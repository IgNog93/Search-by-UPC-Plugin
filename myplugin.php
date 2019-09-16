<?php 
/**
 * Plugin Name: Search by UPC
 * Description: This is a plugin that allows us to search products information through an External UPC Database
 * Version: 1.0.0
 * Author: Igor Nogueira
 * Author URI: http://igornogueira.br
 * License: GPL2
 */

function test_ajax_load_scripts() {
    // load our jquery file that sends the $.post request
    wp_enqueue_script( "mainjs", plugin_dir_url( __FILE__ ) . '/main.js', array( 'jquery' ) );

    // make the ajaxurl var available to the above script
    wp_localize_script( 'mainjs', 'the_ajax_script', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );	

    wp_register_style('plugin_style', plugins_url('/styles.css',__FILE__ ));
    wp_enqueue_style('plugin_style');
}
add_action('wp_print_scripts', 'test_ajax_load_scripts');

function text_ajax_process_request() {
    // first check if data is being sent and that it is the data we want
    if ( isset( $_POST["post_var"] ) ) {
        // now set our response var equal to that of the POST var (this will need to be sanitized based on what you're doing with with it)
        $response = 'https://api.upcitemdb.com/prod/trial/lookup?upc='.$_POST["post_var"];
        // send the response back to the front end

        $ch = curl_init($response);                                                                      
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Accept: application/json'
        ));
        $data = curl_exec($ch);
        $json = $data;
        
        echo $json;
        die();
    }
}

add_action('wp_ajax_test_response', 'text_ajax_process_request');
