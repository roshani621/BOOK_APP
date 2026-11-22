
import { message, notification } from 'antd';

// Short messages
export const showMessage = (type, content) => {
    message[type](content);
};

// Detailed notifications
export const showNotification = (
    type,
    title,
    description
) => {
    notification[type]({
        message: title,
        description,
        placement: 'topRight',
        duration: 4
    });
};

// Application action notifications
export const appNotification = {
    login: (username) =>
        showNotification(
            'success',
            `Welcome!, ${username}`,
            'You have logged in successfully.'
        ),
    loginError: () =>
        showNotification(
            'error',
            'Login Failed',
            `Invalid username and password. please try again!`,
            
        ),

    addBook: (bookName) =>
        showNotification(
            'success',
            'New Book Added',
            `${bookName} has been successfully added to the library.`
        ),

    updateBook: (bookName) =>
        showNotification(
            'success',
            'Book Updated',
            `${bookName} details have been updated successfully.`
        ),

    borrowRequest: (bookName) =>
        showNotification(
            'info',
            'Borrow Request Submitted',
            `Your request for ${bookName} has been submitted successfully.`
        ),

    approveRequest: (bookName) =>
        showNotification(
            'success',
            'Request Approved',
            `Your borrow request for ${bookName} has been approved.`
        ),

    rejectRequest: (bookName) =>
        showNotification(
            'error',
            'Request Rejected',
            `Your borrow request for ${bookName} has been rejected.`
        ),

    returnBook: (bookName) =>
        showNotification(
            'success',
            'Book Returned',
            `${bookName} has been returned successfully.`
        )
};
