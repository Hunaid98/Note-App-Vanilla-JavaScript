export default class NotesView {
    constructor(root, {onNoteSelect, onNotedAdd, onNoteDelete, onNoteEdit}={}){
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNotedAdd = onNotedAdd;
        this.onNoteDelete = onNoteDelete;
        this.onNoteEdit = onNoteEdit;
        this.root.innerHTML = `
            <div class="notes__sidebar">
                <button class="notes__add" type="button">Add Note</button>
                <div class="notes__list"></div>
            </div>
            <div class="notes__preview">
                <input type="text" class="notes__title" placeholder="Title">
                <textarea class="notes__body">Tell your story...</textarea>
            </div>
        `;


        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        //Add Button Event Listner
        btnAddNote.addEventListener("click", ()=>{
            this.onNotedAdd();
        });

        [inpTitle, inpBody].forEach(inpField =>{
            inpField.addEventListener("blur",()=>{
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });


        this.updatePreviewVisibility(false);
    }


    _createListItemHtml(id, title, body, update){

        const Max_Body_Length = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                ${body.substring(0,Max_Body_Length)}
                ${body.length> Max_Body_Length ? "..." : " "}
                </div>
                <div class="notes__small-updated">
                    ${update.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short"})}
                </div>
            </div>
        `;

    }


    updateNoteList(notes){
        const notesListContainer = this.root.querySelector(".notes__list");

        //Empty List
        notesListContainer.innerHTML = "";
        console.log(notes);
        for (const note of notes) {
            const html = this._createListItemHtml(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        //Add select/delete on Each item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem =>{
            noteListItem.addEventListener("click", ()=>{
                this.onNoteSelect(noteListItem.dataset.noteId);
            });


            noteListItem.addEventListener("dblclick", ()=>{
                const onDlt = confirm("Are your sure you want to delete this note?");
  
                if(onDlt){
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });


        });


    }

    updateActiveNote(note){
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem =>{
            noteListItem.classList.remove("notes__list-item--selected");
        })

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updatePreviewVisibility(visible){
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible": "hidden"
    }
}