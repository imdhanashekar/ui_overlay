<?php
header('Content-Type: application/json');

// This is your shared secret key. Make it complex and unique!
// It must match the key in master_overlay.html and control_panel.html
$api_key = 'your_secure_api_key_here';
$state_file = 'state.txt';

// Handle incoming commands (from the control panel)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['page']) && isset($data['key']) && $data['key'] === $api_key) {
        file_put_contents($state_file, $data['page']);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid key or page not specified.']);
    }
}

// Handle requests for the current state (from the master overlay)
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($state_file)) {
        $page = trim(file_get_contents($state_file));
        echo json_encode(['page' => $page]);
    } else {
        echo json_encode(['page' => 'going-live-screen']); // Default page if state file doesn't exist
    }
}
?>
