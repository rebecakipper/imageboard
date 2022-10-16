import * as Vue from "./vue.js";

Vue.createApp({
    methods: {
        upload(e) {
            const form = e.currentTarget;
            //console.log({ form });

            // get the file input
            // check its files.
            // if no files, set error message!
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
    },
    data() {
        return {
            message: "Please upload an image",
            images: [],
        };
    },
    mounted() {
        this.state = "mounted";

        fetch("/images")
            .then((res) => res.json())
            .then((images) => {
                console.log({ images });
                this.images = images;
            });
    },
}).mount("#main");
