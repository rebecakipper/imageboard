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
                .then((image) => {
                    this.image = image;
                });
        },
        emmitCloseModal(e) {
            this.$emit("close");
        },
    },
    mounted() {
        if (this.imageId) {
            this.getImageData(this.imageId);
        }
    },

    template: `
    <div class="background" @click.self="emmitCloseModal">
        <div class="modal">
            <div class="img-modal" v-if="image">
                <img class="modal-image" :src="image.url" alt="image">
                <h3>{{image.title}}</h3>
                <h4> {{image.description}}</h4>
                <p>uploaded by {{image.username}} on {{image.created_at}}</p>
            </div>
            <comment-section :image-id=imageId></comment-section>
            
        </div>
    </div>`,
};

export default imageModal;
