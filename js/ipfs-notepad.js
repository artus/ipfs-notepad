const IPFS_README_FILE_URL = "/ipfs/QmVLDAhCY3X9P2uRudKAryuQFPM5zqA3Yij1dY8FpGbL7T/readme";

let ipfsNotepadApp = new Vue({
    el: '#ipfs-notepad-app',
    data: {
        node: new Ipfs({
            repo: `ipfs-${Math.random().toString().split('.')[1]}}-repo`,
        }),
        file: 'Loading, please wait...',
        logging: true,
    },
    methods: {
        init() {

            this.log("Initializing node.");

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
            });
        },
        handleError(error) {
            this.log(error);
        },
        log(message) {
            let time = new Date().toLocaleTimeString();
            if (this.logging) console.info(`[LOG] ${time}: ${message}`);
        }
    }
});

ipfsNotepadApp.init();