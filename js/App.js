import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App{
    constructor(root){
        this.note = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handler());

        this._refreshNote();
    }

    _refreshNote(){
        const notes = NotesAPI.getAllNotes();

        this._setNote(notes);

        if(notes.length>0){
            this._setActiveNote(notes[0]);
        }
    }

    _setActiveNote(note){
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _setNote(notes){
        this.note = notes;
        this.view.updateNoteList(notes);
        this.view.updatePreviewVisibility(notes.length>0);
    }

    _handler(){
        return{
            onNoteSelect: noteId=>{
                const selectedNote = this.note.find(note=> note.id == noteId);
                this._setActiveNote(selectedNote);
            },

            onNotedAdd: ()=>{
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };
                NotesAPI.saveNote(newNote);
                this._refreshNote();

            },

            onNoteEdit: (title, body)=>{
               NotesAPI.saveNote({
                   id: this.activeNote.id,
                   title,
                   body
               });
               this._refreshNote();
            },

            onNoteDelete: noteId=>{
                NotesAPI.deleteNote(noteId);
                this._refreshNote();
            }

        };
    }
}