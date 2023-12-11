//Riley Weaver
//Final Project
//End date: 12/11/23

//1
function createElemWithText(elementName = "p", textContent = "", className)
{
    const element = document.createElement(elementName);

    element.textContent = textContent;
    
    if (className) 
    {
        element.className = className;
    }
    
    return element;
}
//2
function createSelectOptions(users)
 {
    if (!users) 
    {
        return undefined; // Return undefined 
    }

    const options = [];

    users.forEach(user => 
    {
        const option = document.createElement('option');

        option.value = user.id;

        option.textContent = user.name;

        options.push(option);

    });

    return options;
}

//3
function toggleCommentSection(postId)
 {
    if (postId === undefined) 
    {
        return undefined;
    }

    // Select section with the data-post-id attribute equal to postId
    let section = document.querySelector(`[data-post-id="${postId}"]`);

    // Return null if section was not found for the postId
    if (!section && postId !== null) {
        return null;
    }

    // Checking if section exists before toggling the 'hide' class
    if (section) {
        section.classList.toggle('hide');
    }

    return section;
}
//4
function toggleCommentButton(postId)
 {
    if (postId === undefined) 
    {
        return undefined;
    }

    // Select button with the data-post-id  equal to postId
    let button = document.querySelector(`button[data-post-id="${postId}"]`);

    // Return null if no button was found for the postId
    if (!button && postId !== null) {
        return null;
    }

    // Toggle the textContent based on the current content
    if (button.textContent === 'Show Comments')
    {
        button.textContent = 'Hide Comments';
    } 
    else if (button.textContent === 'Hide Comments') 
    {
        button.textContent = 'Show Comments';
    }

    return button;
}
//5
function deleteChildElements(parentElement) 
{
    if (!parentElement || !(parentElement instanceof Element))
    {
        return undefined;  //return undefined if no HTML
    }

    let child = parentElement.lastElementChild;

    while (child) 
    {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }

    return parentElement;
}
//6
function addButtonListeners()
{
    const buttons = document.querySelectorAll('main button');

    if (!buttons || buttons.length === 0) 
    {
        return []; // Return an empty array if no buttons found
    }

    buttons.forEach(button => 
    {
        const postId = button.dataset.postId;
        if (postId) 
        {
            button.addEventListener('click', (event) => 
            {
                toggleComments(event, postId);
            });
        }
    });

    return buttons; // Return selected button elements
}


//7
function removeButtonListeners() // similar thing to addButtonListener
 {
    const buttons = document.querySelectorAll('main button');

    if (buttons.length === 0) 
    {
        return buttons; // Returns empty button if no button is found 
    }

    buttons.forEach(button =>
     {
        const postId = button.dataset.id;
        if (postId) 
        {
            button.removeEventListener('click', (event) => 
            {
                toggleComments(event, postId);
            });
        }
    });

    return buttons; // Return selected button elements
}

//8
function createComments(commentsData) 
{
    if (!commentsData) 
    {
        return undefined; // Return undefined if no commentsData
    }

    const fragment = document.createDocumentFragment();

    commentsData.forEach(comment =>  //below mostly came from the directons
    {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const bodyParagraph = createElemWithText('p', comment.body);
        const emailParagraph = createElemWithText('p', `From: ${comment.email}`);

        article.appendChild(h3);
        article.appendChild(bodyParagraph);
        article.appendChild(emailParagraph);

        fragment.appendChild(article);
    });

    return fragment;  //returns fragment
}

//9
function populateSelectMenu(usersData)
{
    const selectMenu = document.getElementById('selectMenu');

    if (!selectMenu || !usersData) 
    {
        return; // If no select menu or users data, exit function
    }

    const options = createSelectOptions(usersData);

    options.forEach(option => 
    {
        selectMenu.appendChild(option);
    });

    return selectMenu;
}

//10
async function getUsers() 
{
    try 
    {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) 
        {
            return undefined;
        }

        const userData = await response.json();
        return userData;
    } 
    catch (error) 
    {
        return error; 
    }
}

//11
async function getUserPosts(userId) 
{
    if (userId === undefined) 
    {
        return undefined; // Return undefined if no user ID parameter is provided
    }

    try 
    {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        
        const postData = await response.json();

        return postData;
    } catch (error) 
    {
         return undefined; 
    }
}

//12
async function getUser(userId) 
{
    if (userId === undefined)
    {
        return undefined; // Return undefined if no user ID parameter is provided
    }

    try 
    {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        const userData = await response.json();

        return userData;
    } 

    catch (error) 
    {

    return undefined; 

    }
}

//13
async function getPostComments(postId) 
{
    if(!postId)
    {
        return undefined; //return undefined
    }
    try 
    {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  
      const comments = await response.json();

      return comments;

    } 
    catch (error) 
    {
        return null;
    }
}
  

//14
async function displayComments(postId)
{
    if (postId === undefined) 
    {
        return undefined; // Return undefined if no postId is provided
    }

    const section = document.createElement('section');

    section.dataset.postId = postId;

    section.classList.add('comments', 'hide');

    try 
    {
        const comments = await getPostComments(postId);

        const fragment = createComments(comments);

        section.appendChild(fragment);

        return section;

    } 
    catch (error) 
    {
        return undefined; 
    }
}
//15
async function createPosts(postsData)
{

    if (!Array.isArray(postsData) || postsData.length === 0) 
    {
        return undefined; // Return undefined if no posts data is provided or is empty
    }

    const fragment = document.createDocumentFragment();

    for (const post of postsData)
    {
        const article = document.createElement('article');

        const h2 = createElemWithText('h2', post.title);
        const pBody = createElemWithText('p', post.body);
        const pPostId = createElemWithText('p', `Post ID: ${post.id}`);

        const author = await getUser(post.userId);
        const pAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const pCatchPhrase = createElemWithText('p', author.company.catchPhrase);

        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;

        article.appendChild(h2);
        article.appendChild(pBody);
        article.appendChild(pPostId);
        article.appendChild(pAuthor);
        article.appendChild(pCatchPhrase);
        article.appendChild(button);

        const section = await displayComments(post.id);
        article.appendChild(section);

        fragment.appendChild(article);
    }

    return fragment;
}
//16
async function displayPosts(posts) 
{
    const mainElement = document.querySelector('main');
    let element;

    if (posts && posts.length > 0) 
    {
        element = await createPosts(posts);
    } 
    else 
    {
        element = document.createElement('p');
        element.textContent = 'Select an Employee to display their posts.';
        element.classList.add('default-text');
    }

    mainElement.appendChild(element);

    return element;
}

//17
function toggleComments(event, postId)
{
    if (!event || !postId) 
    {
        return undefined;
    }

    event.target.listener = true;

    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}

//18
async function refreshPosts(postsData)
{
    if (!postsData) 
    {
        return undefined;
    }

    const mainElement = document.querySelector('main');

    const removeButtons = removeButtonListeners();
    const fragment = deleteChildElements(mainElement);

    const fragmentResult = await displayPosts(postsData);
    const isFragment = fragmentResult instanceof DocumentFragment;

    mainElement.appendChild(fragmentResult);

    const addButtons = addButtonListeners();

    return [removeButtons, mainElement, fragmentResult, addButtons];

}

//19
async function selectMenuChangeEventHandler(event)
{
    if (!event) 
    {
        return undefined; // Return undefined if no event 
    }
    const selectMenu = event.target;

    if (!selectMenu)
    {
        return undefined; // Return undefined if selectMenu is not found
    }  

    // Disable the select menu 
    selectMenu.disabled = true;

    const userId = event.target.value || 1;

  
    // Enable the select menu after results
    selectMenu.disabled = false;

    // Return an array with userId, posts, and refreshPostsArray
    return [userId, posts, refreshPostsArray];
}

//20
async function initPage()
{
    try 
    {
        // Call getUsers
        const users = await getUsers();

        // Call populateSelectMenu with users data
        const select = await populateSelectMenu(users);

        // Return an array with users data andselect 
        return [users, select];
    } 
    catch (error) 
    {
      return undefined;
    }
}
//21
function initApp() {
   
    // Call initPage function
    initPage()
        .then(([users, select]) => 
    {
            // Select the selectMenu element by id
            const selectMenu = document.getElementById('selectMenu');
            
            // Add an event listener for the change event
            selectMenu.addEventListener('change', (event) =>
            {
                // Call selectMenuChangeEventHandler when the change event fires
                selectMenuChangeEventHandler(event);
            });
    })
        .catch(error =>
        {
            return undefined;
        });
}

// Event listener for "DOMContentLoaded"
document.addEventListener('DOMContentLoaded', () => 
{
    // Call initApp
    initApp();
});







