const IPFS_README_FILE_URL = "/ipfs/QmVLDAhCY3X9P2uRudKAryuQFPM5zqA3Yij1dY8FpGbL7T/about";

let ipfsNotepadApp = new Vue({
    el: '#ipfs-notepad-app',
    data: {
        node: undefined,
        file: 'Loading, please wait... \nIf nothing comes up after 1 minute, consider checking if your browser is compatible.',
        logging: true,
        previousValue: undefined,
    },
    methods: {
        init() {

            try {
                this.log("Initializing node.");
                this.node = new Ipfs({
                    repo: `ipfs-${Math.random().toString().split('.')[1]}}-repo`,
                });
            }
            catch (error) {
                this.log(`Error: Looks like your browser can not work with IPFS.`);
                this.log(error);

                this.file = "Sorry, looks like your browser can not work with IPFS.";
            }

            this.node.on('start', () => {
                this.log("Node started.");
                this.loadFile(IPFS_README_FILE_URL);
            })
        },
        loadFile(fileUrl) {

            this.log(`Loading file ${fileUrl}.`);
            this.node.files.cat(fileUrl, (err, file) => {
                if (err) handleError(err);
                this.file = file.toString('utf-8');
                document.getElementById('ipfs-notepad-textarea').readOnly = false;
            });
        },
        handleError(error) {
            this.log(error);
        },
        newFile() {
            this.file = "";
        },
        openFile() {
            let fileName = prompt("Enter filename:");
            if (fileName != null && typeof fileName != "undefined" && fileName != "") {
                this.loadFile(fileName);
            }
            else this.log("Invalid filename.");
        },
        saveFile() {
            let fileName = prompt("Enter filename:");

            if (fileName != null && typeof fileName != "undefined" && fileName != "") {
                log (`Attempting to save file to ${fileName}.`);
                this.node.files.add({
                    path: fileName,
                    content: buffer.Buffer.from(this.file)
                }, (err, filesAdded) => {
                    if (err) console.error(err);
                    else {
                        console.log(`https://ipfs.io/ipfs/${filesAdded[0].hash}`);
                        alert(`Saved file: https://ipfs.io/ipfs/${filesAdded[0].hash}`);
                    }
                });
            }
            else this.log("Invalid filename.");
        },
        exitApp() {
            window.location.href = "https://www.github.com/artus";
        },
        log(message) {
            let time = new Date().toLocaleTimeString();
            if (this.logging) console.info(`[LOG] ${time}: ${message}`);
        }
    }
});

ipfsNotepadApp.init();