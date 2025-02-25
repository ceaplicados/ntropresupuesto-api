<?php 
header('Content-Type: application/json; charset=utf-8');

$_uris=array();

$request_uri=$_SERVER["REQUEST_URI"];
if(strpos($_SERVER["REQUEST_URI"], '?')!==false){
	$request_uri=substr($_SERVER["REQUEST_URI"], 0,strpos($_SERVER["REQUEST_URI"], '?'));
}
$request_uri=substr($request_uri, 1);

if(file_exists($_SERVER['DOCUMENT_ROOT'].'/../api/'.$request_uri.'.php')){
	include($_SERVER['DOCUMENT_ROOT'].'/../api/'.$request_uri.'.php');
}elseif(file_exists($_SERVER['DOCUMENT_ROOT'].'/../api/'.$request_uri.'.json')){
	include($_SERVER['DOCUMENT_ROOT'].'/../api/'.$request_uri.'.json');
}elseif(isset($_uris[$request_uri])){
	$request_uri=$_uris[$request_uri];
	include($_SERVER['DOCUMENT_ROOT'].'/'.$request_uri.'.php');
}else{
	include($_SERVER['DOCUMENT_ROOT'].'/404.php?uri='.$request_uri);
	exit();
}