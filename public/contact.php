<?php
/**
 * Script de contacto para Diosmasgym Records
 * Envía el mensaje al administrador y opcionalmente podría enviar un auto-responder.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos del JSON
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = strip_tags(trim($data["name"]));
    $email = filter_var(trim($data["email"]), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($data["_subject"] ?? "Nuevo mensaje de la web"));
    $message = strip_tags(trim($data["message"]));

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["message" => "Por favor completa todos los campos correctamente."]);
        exit;
    }

    // DESTINATARIO
    $recipient = "administrador@diosmasgym.com";

    // CONTENIDO DEL CORREO
    $email_content = "Nombre: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Asunto: $subject\n\n";
    $email_content .= "Mensaje:\n$message\n";

    // CABECERAS
    $email_headers = "From: Web Diosmasgym <noreply@diosmasgym.com>\r\n";
    $email_headers .= "Reply-To: $email\r\n";

    // ENVÍO
    if (mail($recipient, "NUEVO CONTACTO: $subject", $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["message" => "¡Mensaje enviado con éxito!"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error del servidor al enviar el correo."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["message" => "Acceso no permitido."]);
}
?>