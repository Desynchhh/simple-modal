// import "./css/modal.css";
/**
 * Generates a Modal in your HTML.
 *
 * Requires your HTML to contain a `template` and a `button` with `data-target` attributes with the same value as `modalId`.
 *
 * The content of your `template` will then be the content of the Modal.
 *
 * @param {string} modalId The Modal's unqiue identifier.
 * @param {boolean} showClose Show the default close button.
 */
export default class Modal {
    private isActive: boolean;
    private showClose: boolean;
    private modalId: string;
    private triggerButton: HTMLButtonElement | null;
    private modalContainer!: HTMLDivElement;
    private modalTemplate!: HTMLTemplateElement | null;

    private inactiveClass = "inactive";
    private openClass = "open";
    private animationTime = 200;

    constructor(modalId: string, showClose: boolean = true) {
        this.isActive = false;
        this.showClose = showClose;
        this.modalId = modalId;
        this.triggerButton = document.querySelector(
            `button[data-target=${this.modalId}]`
        );
        this.modalTemplate = document.querySelector(
            `template[data-target=${this.modalId}]`
        );
        if (!this.triggerButton || !this.modalTemplate) {
            if (!this.triggerButton) {
                console.warn(
                    `No button with the attribute 'data-target="${this.modalId}"' found.`
                );
            }
            if (!this.modalTemplate) {
                console.warn(
                    `No template with the attribute 'data-target="${this.modalId}"' found.`
                );
            }
            console.warn("Did not spawn modal.");
            return;
        }
        this.modalContainer = this.spawn();

        this.setListeners();

        this.loadCss();
        console.log("successfully spawned modal!");
    }

    private loadCss() {
        const link = document.createElement("link");
        link.href = "/simple-modal/css/modal.css";
        link.type = "text/css";
        link.rel = "stylesheet";

        document.getElementsByTagName("head")[0].appendChild(link);
    }

    private setListeners() {
        this.triggerButton?.addEventListener("click", (_e) => {
            this.activate();
        });

        this.modalContainer
            ?.querySelector(".modal-bg")
            ?.addEventListener("click", (_e) => {
                this.deactivate();
            });

        this.modalContainer
            .querySelector(".modal-close")
            ?.addEventListener("click", (_e) => {
                this.deactivate();
            });
    }

    private spawn(): HTMLDivElement {
        const modal = this.build();
        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Shows the modal
     */
    public activate() {
        if (this.isActive) {
            return;
        }

        this.modalContainer.classList.remove(this.inactiveClass);
        setTimeout(() => {
            this.modalContainer.classList.add(this.openClass);
        }, 1);
        this.isActive = true;
    }

    /**
     * Hides the modal
     */
    public deactivate() {
        if (!this.isActive) {
            return;
        }

        this.modalContainer.classList.remove(this.openClass);
        setTimeout(() => {
            this.modalContainer.classList.add(this.inactiveClass);
            this.isActive = false;
        }, this.animationTime);
    }

    private build(): HTMLDivElement {
        const templateContent = this.modalTemplate?.content.cloneNode(
            true
        ) as HTMLTemplateElement;

        const htmlString = `
		<div class="modal-container inactive">
			<div class="modal-bg"></div>
			<div id="${this.modalId}" class="modal">
			</div>
		</div>`;

        const dummyDiv = document.createElement("div");
        dummyDiv.innerHTML = htmlString.trim();
        const contentDiv = dummyDiv.firstChild as HTMLDivElement;

        const modal = contentDiv.querySelector(
            `#${this.modalId}`
        ) as HTMLDivElement;

        if (this.showClose) {
            const closingSpan = document.createElement("span");
            closingSpan.classList.add("modal-close");
            closingSpan.innerHTML = "&times;";

            modal.appendChild(closingSpan);
        }

        modal.appendChild(templateContent);

        return contentDiv;
    }
}
