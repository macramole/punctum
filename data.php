<?
// echo ( json_encode([
//     "features" => $selectedFeatures,
//     "questions" => $selectedQuestions,
//     "video" => $selectedVideo
// ]));
// print_r($_GET);

$FILE = "results.json";

$jsonResults = json_decode( file_get_contents($FILE), true );
$jsonResults[] = $_GET;
file_put_contents($FILE, json_encode($jsonResults));
// file_put_contents($FILE, json_encode($_GET));
