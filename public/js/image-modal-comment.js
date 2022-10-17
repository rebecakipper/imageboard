const imageModalComment = {
    data() {
        return {
            heading: "This is my image-modal!",
        };
    },
    template: `
    <div class="comment-section">
        <div class="comment-upload">
            <form action="/comment/upload" method="post"> 
                <h2> Add a comment!</h2>  
                <label for="insert-comment">Your comment:</label>
                <input type="text" name="insert-comment">
                <label for="insert-username">Username:</label>
                <input type="text" name="insert-username">
                <button type="submit">submit</button>
            </form>
        </div> 
        <div class="comments-container">
            <div class="comment">
                <h4>{{comment}}</h4>
                <p>{{username}} on {{created_at}}</p>
            </div>
        </div>
    </div>`,
};

export default imageModalComment;
