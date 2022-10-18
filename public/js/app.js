import * as Vue from "./vue.js";
import imageModal from "./image-modal.js";

Vue.createApp({
    methods: {
        upload(e) {
            const form = e.currentTarget;
            const fileInput = form.querySelector("input[type=file]");
            console.log(fileInput.files);

            if (fileInput.files.length < 1) {
                this.message = "You must first select a file!";
                return;
            }

            const myFormData = new FormData(form);

            fetch(form.action, {
                method: "post",
                body: myFormData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message) {
                        this.message = data.message;
                        return;
                    }

                    if (data.url) {
                        this.images.push(data);
                    }
                });
        },
        showModal(id) {
            this.displayModal = true;
            this.clickedImageId = id;
        },
        closeModal() {
            this.displayModal = false;
        },
        getMoreImages() {
            this.lastId = this.images[this.images.length - 1].id;
            //console.log(this.lastId, this.images);
            const fetchPath = "/images/more?lastId=" + this.lastId;
            fetch(fetchPath)
                .then((res) => res.json())
                .then((result) => {
                    const { images, id } = result;
                    const [a, b, c] = images;
                    this.lastId = id;
                    this.images.push(a, b, c);
                });
        },
    },
    data() {
        return {
            message: "Please upload an image",
            images: [],
            displayModal: null,
            clickedImageId: null,
            lastId: 0,
        };
    },
    components: {
        "image-modal": imageModal,
    },

    mounted() {
        this.state = "mounted";

        fetch("/images")
            .then((res) => res.json())
            .then((images) => {
                this.images = images;
            });
    },
}).mount("#main");
