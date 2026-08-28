<?php
/**
 * Kontakt forma — veseli.fit
 * Prima POST podatke sa forme, validira ih i šalje mail na nemanja@vese.li.
 * Radi na standardnom PHP hostingu (nema potrebe za dodatnim bibliotekama).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

// --- Samo POST zahtjevi ---
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metoda nije dozvoljena.']);
    exit;
}

// --- Honeypot: botovi popune skriveno polje "website", ljudi ga nikad ne vide ---
if (!empty(trim($_POST['website'] ?? ''))) {
    // Tiho "uspješno" — bot ne treba da zna da je uhvaćen
    echo json_encode(['success' => true]);
    exit;
}

/** Ukloni prelome linija (spriječava email header injection) i escape-uje HTML. */
function clean_field(string $value): string
{
    $value = trim($value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$name    = clean_field($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = clean_field($_POST['phone'] ?? '');
$height  = clean_field($_POST['height'] ?? '');
$weight  = clean_field($_POST['weight'] ?? '');
$message = trim($_POST['message'] ?? '');

// --- Validacija ---
$errors = [];

if (mb_strlen($name) < 2) {
    $errors[] = 'Ime i prezime su obavezni.';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email adresa nije validna.';
}

if (mb_strlen($message) > 5000) {
    $errors[] = 'Poruka je predugačka.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// Email ide u header (Reply-To), pa i njega čistimo od prelomа linija
$emailForHeader = str_replace(["\r", "\n"], '', $email);
$messageClean   = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// --- Sastavljanje mail-a ---
$to      = 'nemanja@vese.li';
$subject = '=?UTF-8?B?' . base64_encode('Nova poruka sa sajta — ' . $name) . '?=';

$body  = "Nova poruka sa kontakt forme (veseli.fit)\n";
$body .= "-------------------------------------------\n\n";
$body .= "Ime i prezime: {$name}\n";
$body .= "Email: {$emailForHeader}\n";
$body .= 'Telefon: ' . ($phone !== '' ? $phone : '—') . "\n";
$body .= 'Visina: ' . ($height !== '' ? $height . ' cm' : '—') . "\n";
$body .= 'Kilaža: ' . ($weight !== '' ? $weight . ' kg' : '—') . "\n\n";
$body .= "Poruka:\n" . ($messageClean !== '' ? $messageClean : '—') . "\n";

// From mora biti na istom domenu kao server, inače mnogi hostovi odbace/markiraju kao spam.
// Reply-To je pošiljalac — klik na "Reply" u mail klijentu ide direktno njemu/njoj.
$headers   = [];
$headers[] = 'From: Veseli Fit <noreply@veseli.fit>';
$headers[] = "Reply-To: {$name} <{$emailForHeader}>";
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Poruka je uspješno poslata! Javljamo se uskoro.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Došlo je do greške pri slanju. Pokušaj ponovo ili nas kontaktiraj direktno na nemanja@vese.li.']);
}
