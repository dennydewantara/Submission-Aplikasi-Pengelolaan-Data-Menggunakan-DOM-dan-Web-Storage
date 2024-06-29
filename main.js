document.addEventListener('DOMContentLoaded', function () {
    const RENDER_EVENT = 'render-book';
    const STORAGE_KEY = 'BOOKSHELF_APPS';
    let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const bookForm = document.getElementById('bookForm');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const bookFormSubmitButton = document.getElementById('bookFormSubmit');

    bookForm.addEventListener('input', validateForm);

    function validateForm() {
        const bookTitle = document.getElementById('bookFormTitle').value;
        const bookAuthor = document.getElementById('bookFormAuthor').value;
        const bookYear = document.getElementById('bookFormYear').value;

        if (bookTitle.trim() !== '' && bookAuthor.trim() !== '' && bookYear.trim() !== '') {
            bookFormSubmitButton.removeAttribute('disabled');
        } else {
            bookFormSubmitButton.setAttribute('disabled', 'disabled');
        }
    }

    bookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    function addBook() {
        const bookTitle = document.getElementById('bookFormTitle').value;
        const bookAuthor = document.getElementById('bookFormAuthor').value;
        const bookYear = document.getElementById('bookFormYear').value;
        const isComplete = document.getElementById('bookFormIsComplete').checked;

        if (bookTitle.trim() === '' || bookAuthor.trim() === '' || bookYear.trim() === '') {
            alert('Harap lengkapi semua kolom formulir.');
            return;
        }

        const book = {
            id: +new Date(),
            title: bookTitle,
            author: bookAuthor,
            year: parseInt(bookYear),
            isComplete: isComplete
        };

        books.push(book);
        saveBooks();
        document.dispatchEvent(new Event(RENDER_EVENT));

        bookFormSubmitButton.setAttribute('disabled', 'disabled');

        clearForm();
    }

    function saveBooks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }

    function loadBooksFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        const data = JSON.parse(serializedData);

        if (data !== null) {
            books = data;
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function makeBookElement(book) {
        const bookElement = document.createElement('article');
        bookElement.classList.add('book_item');
        bookElement.setAttribute('data-id', book.id);

        const bookTitle = document.createElement('h3');
        bookTitle.innerText = book.title;
        const bookAuthor = document.createElement('p');
        bookAuthor.innerText = 'Penulis: ' + book.author;
        const bookYear = document.createElement('p');
        bookYear.innerText = 'Tahun: ' + book.year;
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');

        const toggleButton = document.createElement('button');
        toggleButton.classList.add(book.isComplete ? 'orange' : 'green');
        toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';

        toggleButton.addEventListener('click', function () {
            toggleBookStatus(book.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';

        deleteButton.addEventListener('click', function () {
            deleteBook(book.id);
        });

        actionContainer.append(toggleButton, deleteButton);
        bookElement.append(bookTitle, bookAuthor, bookYear, actionContainer);

        return bookElement;
    }

    function toggleBookStatus(bookId) {
        const bookTarget = books.find(book => book.id === bookId);
        if (bookTarget == null) return;

        bookTarget.isComplete = !bookTarget.isComplete;
        saveBooks();
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function deleteBook(bookId) {
        const bookTargetIndex = books.findIndex(book => book.id === bookId);
        if (bookTargetIndex === -1) return;

        books.splice(bookTargetIndex, 1);
        saveBooks();
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function renderBooks() {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        for (const book of books) {
            const bookElement = makeBookElement(book);
            if (book.isComplete) {
                completeBookList.append(bookElement);
            } else {
                incompleteBookList.append(bookElement);
            }
        }
    }

    function clearForm() {
        document.getElementById('bookFormTitle').value = '';
        document.getElementById('bookFormAuthor').value = '';
        document.getElementById('bookFormYear').value = '';
        document.getElementById('bookFormIsComplete').checked = false;
    }

    document.addEventListener(RENDER_EVENT, renderBooks);
    loadBooksFromStorage();
});
