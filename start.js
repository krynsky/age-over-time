module.exports = {
    daemon: true,
    run: [
        {
            method: "shell.run",
            params: {
                venv: "venv",
                env: {},
                message: [
                    "uvicorn main:app --reload --port 8000",
                ],
                on: [{
                    "event": "/http:\\/\\/\\S+/",
                    "done": true
                }]
            }
        },
        {
            method: "local.set",
            params: {
                url: "{{input.event[0]}}/static/index.html",
                html: true
            }
        }
    ]
}
