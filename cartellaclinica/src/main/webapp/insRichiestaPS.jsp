<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<style>
		body,iframe,html{
				height:100%;	
				width:100%;
				padding:0;
				margin:0;
				border:none;
			}
	</style>
</head>
<body >
	<iframe id="frmFenix" src="blank.htm"></iframe>
</body>
<script>
	document.getElementById("frmFenix").src = "<%out.print(request.getParameter("url"));%>";
</script>
</html>