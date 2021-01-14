$(document).ready(function() {

    $(".deleteArticle").click(function() {
        var id = $(".deleteArticle").attr("data-id")
            // console.log(id)\
        $.ajax({
            type: "DELETE",
            url: `/article/${id}`,
            success: (res) => {
                console.log("Deleting Record")
                window.location.href = '/'
            },
            error: (err) => {
                console.log(err);
            }
        })

    })
});