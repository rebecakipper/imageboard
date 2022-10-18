const imageModalComment = {
    data() {
        return {
            comments: [],
            input_username: "",
            input_comment: "",
            displayComments: null,
        };
    },
    props: ["image-id"],
    methods: {
        getCommentsByImage(id) {
            fetch("/comments/" + id)
                .then((res) => res.json())
                .then((comments) => {
                    this.comments = comments;
                });
        },
        uploadComment() {
            const myFormData = {
                username: this.input_username,
                comment: this.input_comment,
            };
            const reqPath = "/comments/" + this.imageId;

            fetch(reqPath, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(myFormData),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message) {
                        this.message = data.message;
                        return;
                    }
                    if (data.comment) {
                        this.comments.push(data);
                    }
                });
        },
    },
    mounted() {
        if (this.imageId) {
            this.getCommentsByImage(this.imageId);
            if (this.comments.lenght > 0) {
                this.displayComments = true;
            }
        }
    },
    template: `
<div class="comment-section">
    <div class="comment-upload">
        <form action="/comments/{{imageId}}" method="post" @submit.prevent="uploadComment">
            <h2>Add a comment!</h2>
            <label for="insert-comment">Your comment:</label>
            <input type="text" name="insert-comment" v-model="input_comment"/>
            <label for="insert-username">Username:</label>
            <input type="text" name="insert-username" v-model="input_username"/>
            <button type="submit">submit</button>
        </form>
    </div>
    <div class="comments-container" >
        <div v-for="comment in comments" class="comment">
            <h4>{{comment.comment}}</h4>
            <p>{{comment.username}} on {{comment.created_at}}</p>
        </div>
    </div>
</div>
`,
};

export default imageModalComment;
