const path = require('path')
module.exports = {
    version: "1.0",
    title: "Age Over Time",
    description: "Generate age progression images using Google Vertex AI",
    icon: "icon.png",
    menu: async (kernel) => {
        let installed = await kernel.exists(__dirname, "venv")
        if (installed) {
            return [{
                html: '<i class="fa-solid fa-play"></i> Start',
                href: "start.json?fullscreen=true&run=true"
            }, {
                html: '<i class="fa-solid fa-rotate"></i> Update',
                href: "install.json?run=true"
            }, {
                html: '<i class="fa-solid fa-trash"></i> Uninstall',
                href: "uninstall.json?run=true"
            }]
        } else {
            return [{
                html: '<i class="fa-solid fa-download"></i> Install',
                href: "install.json?run=true"
            }]
        }
    }
}
