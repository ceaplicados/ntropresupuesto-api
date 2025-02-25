<?php
$data=array();
$data['error']="Page not found";
$data['uri']=$_GET['uri'];
echo(json_encode($data));