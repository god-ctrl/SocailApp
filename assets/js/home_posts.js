{
    //method to submit the form data using ajax
    let createPost = function(){
        let newPostForm=$('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url:'/post/create',
                data: newPostForm.serialize(); 
                success: function(data){
                    console.log(data);
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });

        createPost();
    }
}