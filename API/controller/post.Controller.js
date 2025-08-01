export const addPost =(req,res)=>{
    try {
        // const caption = req.body.caption;
        const {caption} = req.body;
        const image = req.files;
        const user = req.id;
    } catch (error) {
        
    }

    res.status(200).json({
        msg :"post is added"
    })

}