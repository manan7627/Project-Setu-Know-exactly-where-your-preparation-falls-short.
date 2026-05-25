<?php
/**
 * Plugin Name: Setu Core
 * Description: Core functionality for the Setu headless assessment system.
 * Version: 1.0.0
 * Author: AI
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// 1. Register Custom Post Type and Meta
add_action( 'init', 'setu_register_post_type_and_meta' );
function setu_register_post_type_and_meta() {
    register_post_type( 'setu_submission', array(
        'labels'       => array( 'name' => 'Submissions', 'singular_name' => 'Submission' ),
        'public'       => true,
        'show_in_rest' => true,
        'supports'     => array( 'title', 'editor', 'author' ),
    ) );

    $meta_keys = array( 'eval_status', 'target_exam', 'readiness_score', 'skill_gaps', 'mock_test', 'evaluation_summary' );
    foreach ( $meta_keys as $key ) {
        register_post_meta( 'setu_submission', $key, array(
            'show_in_rest' => true,
            'single'       => true,
            'type'         => ( $key === 'readiness_score' ) ? 'integer' : 'string',
        ) );
    }
}

// 2. Custom Authentication (HMAC JWT-like)
add_action( 'rest_api_init', function () {
    // Login Endpoint
    register_rest_route( 'setu/v1', '/login', array(
        'methods'  => 'POST',
        'callback' => 'setu_api_login',
        'permission_callback' => '__return_true',
    ) );

    // Register Endpoint
    register_rest_route( 'setu/v1', '/register', array(
        'methods'  => 'POST',
        'callback' => 'setu_api_register',
        'permission_callback' => '__return_true',
    ) );

    // Submit Endpoint
    register_rest_route( 'setu/v1', '/submit', array(
        'methods'  => 'POST',
        'callback' => 'setu_api_submit',
        'permission_callback' => 'setu_verify_token',
    ) );

    // Results Endpoint
    register_rest_route( 'setu/v1', '/results', array(
        'methods'  => 'GET',
        'callback' => 'setu_api_get_results',
        'permission_callback' => 'setu_verify_token',
    ) );
    
    register_rest_route( 'setu/v1', '/results/(?P<id>\d+)', array(
        'methods'  => 'GET',
        'callback' => 'setu_api_get_result',
        'permission_callback' => 'setu_verify_token',
    ) );
} );

function setu_generate_token( $user_id ) {
    $header = base64_encode( json_encode( array( 'alg' => 'HS256', 'typ' => 'JWT' ) ) );
    $payload = base64_encode( json_encode( array( 'user_id' => $user_id, 'exp' => time() + 86400 * 7 ) ) );
    $signature = hash_hmac( 'sha256', "$header.$payload", SECURE_AUTH_KEY );
    return "$header.$payload.$signature";
}

function setu_verify_token( $request ) {
    $auth = $request->get_header( 'authorization' );
    if ( ! $auth || ! preg_match( '/Bearer\s+(.*)/', $auth, $matches ) ) {
        return new WP_Error( 'rest_forbidden', 'No token provided', array( 'status' => 401 ) );
    }
    $token = $matches[1];
    $parts = explode( '.', $token );
    if ( count( $parts ) !== 3 ) {
        return new WP_Error( 'rest_forbidden', 'Invalid token', array( 'status' => 401 ) );
    }
    list( $header, $payload, $signature ) = $parts;
    $valid_signature = hash_hmac( 'sha256', "$header.$payload", SECURE_AUTH_KEY );
    if ( ! hash_equals( $valid_signature, $signature ) ) {
        return new WP_Error( 'rest_forbidden', 'Invalid signature', array( 'status' => 401 ) );
    }
    $data = json_decode( base64_decode( $payload ), true );
    if ( $data['exp'] < time() ) {
        return new WP_Error( 'rest_forbidden', 'Token expired', array( 'status' => 401 ) );
    }
    wp_set_current_user( $data['user_id'] );
    return true;
}

function setu_api_login( $request ) {
    $params = $request->get_json_params();
    $user = wp_authenticate( $params['username'], $params['password'] );
    if ( is_wp_error( $user ) ) {
        return new WP_Error( 'rest_forbidden', 'Invalid credentials', array( 'status' => 403 ) );
    }
    $token = setu_generate_token( $user->ID );
    return rest_ensure_response( array(
        'token'   => $token,
        'user_id' => $user->ID,
        'username'=> $user->user_login
    ) );
}

function setu_api_register( $request ) {
    $params = $request->get_json_params();
    $username = sanitize_user( $params['username'] ?? '' );
    $email = sanitize_email( $params['email'] ?? '' );
    $password = $params['password'] ?? '';

    if ( empty( $username ) || empty( $email ) || empty( $password ) ) {
        return new WP_Error( 'missing_fields', 'Please fill in all fields', array( 'status' => 400 ) );
    }

    if ( username_exists( $username ) ) {
        return new WP_Error( 'username_taken', 'Username is already taken', array( 'status' => 400 ) );
    }

    if ( email_exists( $email ) ) {
        return new WP_Error( 'email_taken', 'Email is already registered', array( 'status' => 400 ) );
    }

    $user_id = wp_create_user( $username, $password, $email );
    if ( is_wp_error( $user_id ) ) {
        return new WP_Error( 'registration_failed', $user_id->get_error_message(), array( 'status' => 500 ) );
    }

    $token = setu_generate_token( $user_id );
    return rest_ensure_response( array(
        'token'   => $token,
        'user_id' => $user_id,
        'username'=> $username
    ) );
}

function setu_api_submit( $request ) {
    $params = $request->get_json_params();
    $content = sanitize_textarea_field( $params['content'] ?? '' );
    $target_exam = sanitize_text_field( $params['target_exam'] ?? '' );
    $user_id = get_current_user_id();

    $post_id = wp_insert_post( array(
        'post_type'    => 'setu_submission',
        'post_title'   => 'Submission - ' . date( 'Y-m-d H:i:s' ) . ' - User ' . $user_id,
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_author'  => $user_id,
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'db_error', 'Failed to save', array( 'status' => 500 ) );
    }

    update_post_meta( $post_id, 'eval_status', 'pending' );
    update_post_meta( $post_id, 'target_exam', $target_exam );

    // Schedule cron
    wp_schedule_single_event( time(), 'setu_process_submission_event', array( $post_id ) );

    // Attempt to spawn cron immediately so it runs faster locally
    spawn_cron();

    return rest_ensure_response( array( 'status' => 'success', 'post_id' => $post_id, 'eval_status' => 'pending' ) );
}

function setu_api_get_results( $request ) {
    $user_id = get_current_user_id();
    $posts = get_posts( array(
        'post_type'   => 'setu_submission',
        'author'      => $user_id,
        'numberposts' => -1,
    ) );
    
    $results = array();
    foreach ( $posts as $p ) {
        $results[] = array(
            'id'              => $p->ID,
            'title'           => $p->post_title,
            'date'            => $p->post_date,
            'eval_status'     => get_post_meta( $p->ID, 'eval_status', true ),
            'target_exam'     => get_post_meta( $p->ID, 'target_exam', true ),
            'readiness_score' => get_post_meta( $p->ID, 'readiness_score', true ),
        );
    }
    return rest_ensure_response( $results );
}

function setu_api_get_result( $request ) {
    $post_id = (int) $request['id'];
    $post = get_post( $post_id );
    if ( ! $post || $post->post_type !== 'setu_submission' || (int) $post->post_author !== get_current_user_id() ) {
        return new WP_Error( 'not_found', 'Not found or forbidden', array( 'status' => 404 ) );
    }

    return rest_ensure_response( array(
        'id'              => $post->ID,
        'title'           => $post->post_title,
        'content'         => $post->post_content,
        'eval_status'     => get_post_meta( $post->ID, 'eval_status', true ),
        'target_exam'     => get_post_meta( $post->ID, 'target_exam', true ),
        'readiness_score' => get_post_meta( $post->ID, 'readiness_score', true ),
        'skill_gaps'      => json_decode( get_post_meta( $post->ID, 'skill_gaps', true ), true ),
        'mock_test'       => json_decode( get_post_meta( $post->ID, 'mock_test', true ), true ),
        'evaluation_summary' => get_post_meta( $post->ID, 'evaluation_summary', true ),
    ) );
}

// 3. Background Processor
add_action( 'setu_process_submission_event', 'setu_process_submission_handler' );
function setu_process_submission_handler( $post_id ) {
    update_post_meta( $post_id, 'eval_status', 'processing' );
    $post = get_post( $post_id );
    $target_exam = get_post_meta( $post_id, 'target_exam', true );

    $api_key = defined( 'GEMINI_API_KEY' ) ? GEMINI_API_KEY : '';
    if ( ! $api_key ) {
        update_post_meta( $post_id, 'eval_status', 'failed' );
        return;
    }

    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $api_key;

    $payload = array(
        'contents' => array(
            array(
                'parts' => array(
                    array( 'text' => "Target Exam: {$target_exam}\n\nUser Notes:\n{$post->post_content}" )
                )
            )
        ),
        'generationConfig' => array(
            'responseMimeType' => 'application/json',
            'responseSchema' => array(
                'type' => 'OBJECT',
                'properties' => array(
                    'readiness_score' => array( 'type' => 'INTEGER' ),
                    'evaluation_summary' => array( 'type' => 'STRING' ),
                    'skill_gaps' => array(
                        'type' => 'ARRAY',
                        'items' => array( 'type' => 'STRING' )
                    ),
                    'mock_test' => array(
                        'type' => 'ARRAY',
                        'items' => array(
                            'type' => 'OBJECT',
                            'properties' => array(
                                'question' => array( 'type' => 'STRING' ),
                                'type' => array( 'type' => 'STRING' ),
                                'options' => array(
                                    'type' => 'ARRAY',
                                    'items' => array( 'type' => 'STRING' )
                                ),
                                'correct_answer' => array( 'type' => 'STRING' )
                            ),
                            'required' => array( 'question', 'type', 'options', 'correct_answer' )
                        )
                    )
                ),
                'required' => array( 'readiness_score', 'evaluation_summary', 'skill_gaps', 'mock_test' )
            )
        ),
        'systemInstruction' => array(
            'parts' => array(
                array( 'text' => "You are an uncompromising academic evaluator specialized in advanced technical and administrative examinations. Evaluate the content against the standard depth required for advanced competitive examinations. You must return ONLY a valid JSON object." )
            )
        )
    );

    $args = array(
        'body'    => json_encode( $payload ),
        'headers' => array( 'Content-Type' => 'application/json' ),
        'timeout' => 60,
    );

    $response = wp_remote_post( $url, $args );

    if ( is_wp_error( $response ) ) {
        update_post_meta( $post_id, 'eval_status', 'failed' );
        return;
    }

    $body = wp_remote_retrieve_body( $response );
    $data = json_decode( $body, true );

    if ( isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
        $json_str = $data['candidates'][0]['content']['parts'][0]['text'];
        $result = json_decode( $json_str, true );
        
        if ( $result ) {
            update_post_meta( $post_id, 'readiness_score', $result['readiness_score'] );
            update_post_meta( $post_id, 'skill_gaps', wp_slash( json_encode( $result['skill_gaps'] ) ) );
            update_post_meta( $post_id, 'mock_test', wp_slash( json_encode( $result['mock_test'] ) ) );
            update_post_meta( $post_id, 'evaluation_summary', $result['evaluation_summary'] );
            update_post_meta( $post_id, 'eval_status', 'completed' );
        } else {
            update_post_meta( $post_id, 'eval_status', 'failed' );
        }
    } else {
        update_post_meta( $post_id, 'eval_status', 'failed' );
    }
}
