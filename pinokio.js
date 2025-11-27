const path = require('path')
module.exports = {
    version: "2.0",
    title: "Decades Through Time",
    description: "See yourself styled through different decades - from the 1880s to 2030s. AI-generated 4×4 grid showing period-appropriate fashion, hairstyles, and photography styles.",
    icon: "icon.png",
    menu: async (kernel, info) => {
        let installed = info.exists("venv")
        let running = {
            install: info.running("install.json"),
            start: info.running("start.js"),
            uninstall: info.running("uninstall.json")
        }

        if (running.install) {
            return [{
                default: true,
                icon: "fa-solid fa-plug",
                text: "Installing",
                href: "install.json",
            }]
        } else if (installed) {
            if (running.start) {
                let local = info.local("start.js")
                if (local && local.url) {
                    return [{
                        default: true,
                        icon: "fa-solid fa-rocket",
                        text: "Decades Through Time",
                        href: local.url,
                    }, {
                        icon: 'fa-solid fa-terminal',
                        text: "Terminal",
                        href: "start.js",
                    }]
                } else {
                    return [{
                        default: true,
                        icon: 'fa-solid fa-terminal',
                        text: "Starting...",
                        href: "start.js",
                    }]
                }
            } else if (running.uninstall) {
                return [{
                    default: true,
                    icon: 'fa-solid fa-terminal',
                    text: "Uninstalling",
                    href: "uninstall.json",
                }]
            } else {
                return [{
                    default: true,
                    icon: "fa-solid fa-play",
                    text: "Start",
                    href: "start.js",
                }, {
                    icon: "fa-solid fa-rotate",
                    text: "Update",
                    href: "install.json",
                }, {
                    icon: "fa-solid fa-trash",
                    text: "Uninstall",
                    href: "uninstall.json",
                    confirm: "Are you sure you wish to uninstall?"
                }]
            }
        } else {
            return [{
                default: true,
                icon: "fa-solid fa-download",
                text: "Install",
                href: "install.json",
            }]
        }
    }
}
