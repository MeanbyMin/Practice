<?php
    header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Summernote</title>
    <!-- include libraries(jQuery, bootstrap) -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

    <!-- include summernote css/js -->
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
</head>

<body>
    <h2>Summernote</h2>
    <form method="post" action="" method="post">
        <div class="titleArea">
            <input type="text" placeholder="제목을 입력하세요">
        </div>
        <textarea name="summernote" id="summernote"></textarea>
        <p class="btn_area">
            <input type="submit" value="등록">
        </p>
    </form>
    <script type="text/javascript">
        $(function () {
            $('#summernote').summernote({
                height: 500,
                lang: 'ko-KR',
                callbacks: {
                    onImageUpload: function (files, editor, welEditable) {
                        console.log('image upload:', files);
                        sendFile(files[0], this);
                    }
                }
            });
            function sendFile(file, editor) {
                console.log(file);
                data = new FormData();
                data.append("file", file);
                $.ajax({
                    url: "saveimage.php", // image 저장 소스
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (data) {
                        //   alert(data);
                        console.log(data)
                        $('#summernote').summernote('insertImage', data);
                    }
                });
            }
        });
    </script>
</body>

</html>