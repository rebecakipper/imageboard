import imageModalComment from "./image-modal-comment.js";

const imageModal = {
    data() {
        return {
            image: null,
        };
    },
    components: {
        "comment-section": imageModalComment,
    },
    props: ["image-id"],
    methods: {
        getImageData(id) {
            fetch("/image/" + id)
                .then((res) => res.json())
                .then(function (image) {
                    imageModal.data.image = image;
                    console.log(imageModal.data.image);
                });
        },
    },
    mounted() {
        if (this.imageId) {
            this.getImageData(this.imageId);
        }
    },

    template: `
    <div class="background">
        <div class="modal">
            <div class="img-modal">
                <img class="modal-image" src="{{url}}" alt="image">
                <h3>{{title}}</h3>
                <h4> {{description}}</h4>
                <p>uploaded by {{user}} on {{created_at}}</p>
                <comment-section></comment-section>
            </div>
            
        </div>
    </div>`,
};

export default imageModal;
