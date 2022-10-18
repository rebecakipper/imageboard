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
            /*If location.pathname does not have an image id in 
            it when the page loads, the user will have to click 
            on an image to open the modal as usual. That click handler
             should be changed, however, to use pushState to change 
             the url to have the image id in it when the modal is open. 
             When the modal is closed, the url should once again be 
             changed so that it no longer has the image id in it. */
            history.pushState({}, "", "/" + id);
            this.displayModal = true;
            this.clickedImageId = id;
        },
        closeModal() {
            history.pushState({}, "", "/");
            this.displayModal = false;
        },
        getMoreImages() {
            this.lastId = this.images[this.images.length - 1].id;
            //console.log(this.lastId, this.images);
            const fetchPath = "/images/more?lastId=" + this.lastId;
            fetch(fetchPath)
                .then((res) => res.json())
                .then((result) => {
                    this.lastId = result.images[result.images.length - 1].id;
                    const { images, id } = result;
                    this.images.push(...images);
                    if (id === this.lastId) {
                        return (this.showButton = false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    // TODO: handle the error here
                });
        },
    },
    data() {
        /*To make the page show the image modal when it starts up, 
        you can read the location.pathname and see if it contains
         an image id. If it does, you can pass that as the initial 
         value for the property in the object returned by the data 
         function. That should make the modal appear immediately.
 */

        return {
            message: "Please upload an image",
            images: [],
            displayModal: !!location.pathname.split("/")[1],
            clickedImageId: location.pathname.split("/")[1],
            lastId: 0,
            showButton: true,
        };
    },
    components: {
        "image-modal": imageModal,
    },

    mounted() {
        this.state = "mounted";

        /*         You will also want to open and close the modal appropriately 
when the user uses the browser's history navigation buttons to move forward
 or back in the history. To detect that this is happening, you should start
  listening for the popstate event when you initialize your app. 
  In the event handler you can set the reactive property you are using 
  to keep track of the id of the image displayed in the modal to the
   correct value for the new url.
 */
        window.addEventListener("popstate", (e) => {
            console.log(location.pathname, e.state);
            this.displayModal = !!location.pathname.split("/")[1];
            this.clickedImageId = location.pathname.split("/")[1];
            // show whatever is appropriate for the new url
            // if you need it, e.state has the data you passed to `pushState`
        });
        fetch("/images")
            .then((res) => res.json())
            .then((images) => {
                this.images = images;
            });
    },
}).mount("#main");
