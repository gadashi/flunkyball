<html>
<head>
</head>
<body>
<?php
$myfile = fopen("test.txt", "w") or die("Unable to open file!");
$txt = "John Doe\n";
fwrite($myfile, $txt);
$txt = "Jane Doe\n";
fwrite($myfile, $txt);
fclose($myfile);

?>
</body>

</html
