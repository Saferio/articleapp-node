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

    $("#submit").click((e)=>{
    //     // e.preventDefault()
    //     const title=$("#title").val()
        const file=$("#file").val()

    //     if(title=="")
    //     {
    //         $(".error").append(`<div class="alert alert-danger">Title is required</div>`);
            
    //     }

        if(file=="")
        {
            $(".error").append(`<div class="alert alert-danger">File is required</div>`);
            return false
        }

    //     if(title!="" && body!="")
    //     {
    //         return true
    //     }
    //     else
    //     {
    //         return false
    //     }
    })

    $("#editFile").change(()=>{
        let action =$("#editForm").attr('action');
        var res = action.replace("edit", "editUpload");
        $("#editForm").attr('action',res);
        $("#editForm").attr('enctype',"multipart/form-data");
        console.log(action)
    })
});