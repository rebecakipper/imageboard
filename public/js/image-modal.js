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

                    //todo:handle no img

                    /* 
                    Users will be able to type anything they want in a url so you 
                    should probably handle the possibility that what is in the url 
                    is not a valid image id. A simple way to do this is to have your
                     component fire an event to close the modal if the network request
                    to get the image data is not successful. In this situation, it is
                    probably a good idea to use replaceState to change the url so that
                    it is not possible to get back to the invalid url with the browser's
                     history navigation buttons.
                     */
                })
                .catch((err) => {
                    console.log(err);
                    // TODO: handle the error here
                    this.$emit("close");
                    history.replaceState({}, "", "/");
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
            <div class="img-nav">
                <h2 class="arrow-nav">&lt</h2>
                <div class="img-modal" v-if="image">
                    <img class="modal-image" :src="image.url" alt="image">
                    <h2>{{image.title}}</h2>
                    <p> {{image.description}}</p>
                    <p class="uploaded">uploaded by {{image.username}} on {{image.created_at}}</p>
                </div>
                <h2 class="arrow-nav">&gt</h2>
            </div>
            <comment-section :image-id=imageId  v-if="image"></comment-section>
            
        </div>
    </div>`,
};

export default imageModal;
