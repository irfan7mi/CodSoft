let users = JSON.parse(localStorage?.getItem('blogPlatform_users') || '[]');
let posts = JSON.parse(localStorage?.getItem('blogPlatform_posts') || '[]');
let comments = JSON.parse(localStorage?.getItem('blogPlatform_comments') || '[]');
let currentUser = null;

if (posts.length === 0) {
    posts = [
        {
            id: 1,
            title: "Welcome to BlogSpace",
            content: "This is your new blogging platform where you can share your thoughts, ideas, and stories with the world. Create an account to get started!",
            author: "Admin",
            authorId: 0,
            date: new Date().toISOString(),
            excerpt: "Welcome to your new blogging platform..."
        },
        {
            id: 2,
            title: "Getting Started with Blogging",
            content: "Blogging is a great way to express yourself and connect with others. Here are some tips to get you started on your blogging journey.",
            author: "BlogMaster",
            authorId: 0,
            date: new Date(Date.now() - 86400000).toISOString(),
            excerpt: "Learn the basics of successful blogging..."
        }
    ];
    saveData();
}

function saveData() {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('blogPlatform_users', JSON.stringify(users));
        localStorage.setItem('blogPlatform_posts', JSON.stringify(posts));
        localStorage.setItem('blogPlatform_comments', JSON.stringify(comments));
    }
}

function showSection(section) {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('createSection').classList.add('hidden');
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('profileSection').classList.add('hidden');

    if (section === 'login') {
        document.getElementById('loginSection').classList.remove('hidden');
    } else if (section === 'create') {
        document.getElementById('createSection').classList.remove('hidden');
    } else if (section === 'profile') {
        document.getElementById('profileSection').classList.remove('hidden');
        loadProfile();
    } else {
        document.getElementById('homeSection').classList.remove('hidden');
    }
}

function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    if (!email || !password || !username) {
        alert('Please fill in all fields for registration');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }

    const newUser = {
        id: users.length + 1,
        email: email,
        username: username,
        password: password,
        joinDate: new Date().toISOString()
    };

    users.push(newUser);
    saveData();
    alert('Registration successful! You can now login.');
    
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('username').value = '';
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        updateUIForLoggedInUser();
        showSection('home');
        alert('Login successful!');
    } else {
        alert('Invalid email or password');
    }
}

function logout() {
    currentUser = null;
    updateUIForLoggedOutUser();
    showSection('home');
}

function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('createBtn').style.display = 'inline-block';
    document.getElementById('profileBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    
    document.getElementById('sidebarProfile').style.display = 'block';
    document.getElementById('sidebarName').textContent = currentUser.username;
    document.getElementById('sidebarEmail').textContent = currentUser.email;
    document.getElementById('sidebarAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('createBtn').style.display = 'none';
    document.getElementById('profileBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('sidebarProfile').style.display = 'none';
}

function createPost() {
    if (!currentUser) {
        alert('Please login to create a post');
        return;
    }

    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    if (!title || !content) {
        alert('Please enter both title and content');
        return;
    }

    const newPost = {
        id: posts.length + 1,
        title: title,
        content: content,
        author: currentUser.username,
        authorId: currentUser.id,
        date: new Date().toISOString(),
        excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : '')
    };

    posts.unshift(newPost);
    saveData();

    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    
    alert('Post published successfully!');
    showSection('home');
    loadPosts();
}

function loadPosts(searchTerm = '') {
    const container = document.getElementById('postsContainer');
    let filteredPosts = posts;

    if (searchTerm) {
        filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredPosts.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#7f8c8d;">No posts found.</p>';
        return;
    }

    container.innerHTML = filteredPosts.map(post => `
        <div class="post-card">
            <div class="post-title">${post.title}</div>
            <div class="post-meta">By ${post.author} • ${new Date(post.date).toLocaleDateString()}</div>
            <div class="post-excerpt">${post.excerpt}</div>
            <div class="post-actions">
                <button class="btn btn-primary" onclick="viewPost(${post.id})">Read More</button>
                <button class="btn btn-secondary" onclick="showComments(${post.id})">Comments</button>
            </div>
            <div id="comments-${post.id}" class="comments-section hidden">
                <h4>Comments</h4>
                <div id="comments-list-${post.id}"></div>
                ${currentUser ? `
                    <div class="form-group" style="margin-top:20px;">
                        <textarea id="comment-text-${post.id}" placeholder="Write a comment..." style="height:80px;"></textarea>
                        <button class="btn btn-primary" onclick="addComment(${post.id})" style="margin-top:10px;">Add Comment</button>
                    </div>
                ` : '<p><em>Please login to leave a comment.</em></p>'}
            </div>
        </div>
    `).join('');
}

function viewPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        alert(`Title: ${post.title}\n\nContent: ${post.content}`);
    }
}

function showComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    commentsSection.classList.toggle('hidden');
    
    if (!commentsSection.classList.contains('hidden')) {
        loadComments(postId);
    }
}

function loadComments(postId) {
    const postComments = comments.filter(c => c.postId === postId);
    const container = document.getElementById(`comments-list-${postId}`);
    
    if (postComments.length === 0) {
        container.innerHTML = '<p><em>No comments yet.</em></p>';
        return;
    }

    container.innerHTML = postComments.map(comment => `
        <div class="comment">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `).join('');
}

function addComment(postId) {
    if (!currentUser) {
        alert('Please login to add a comment');
        return;
    }

    const text = document.getElementById(`comment-text-${postId}`).value;
    if (!text.trim()) {
        alert('Please enter a comment');
        return;
    }

    const newComment = {
        id: comments.length + 1,
        postId: postId,
        text: text,
        author: currentUser.username,
        authorId: currentUser.id,
        date: new Date().toISOString()
    };

    comments.push(newComment);
    saveData();
    
    document.getElementById(`comment-text-${postId}`).value = '';
    loadComments(postId);
}

function searchPosts() {
    const searchTerm = document.getElementById('searchInput').value;
    loadPosts(searchTerm);
    showSection('home');
}

function loadProfile() {
    if (!currentUser) {
        document.getElementById('userProfileContainer').innerHTML = '<p>Please login to view profile.</p>';
        return;
    }

    const userPosts = posts.filter(p => p.authorId === currentUser.id);
    
    document.getElementById('userProfileContainer').innerHTML = `
        <div class="user-profile">
            <div class="profile-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
            <div class="profile-name">${currentUser.username}</div>
            <div class="profile-email">${currentUser.email}</div>
            <p style="margin-top:15px; color:#7f8c8d;">Member since ${new Date(currentUser.joinDate).toLocaleDateString()}</p>
        </div>
        <h3>Your Posts (${userPosts.length})</h3>
        ${userPosts.length === 0 ? 
            '<p style="text-align:center; color:#7f8c8d;">You haven\'t written any posts yet.</p>' :
            userPosts.map(post => `
                <div class="post-card">
                    <div class="post-title">${post.title}</div>
                    <div class="post-meta">${new Date(post.date).toLocaleDateString()}</div>
                    <div class="post-excerpt">${post.excerpt}</div>
                </div>
            `).join('')
        }
    `;
}

function loadRecentPosts() {
    const recent = posts.slice(0, 3);
    const container = document.getElementById('recentPosts');
    
    container.innerHTML = recent.map(post => `
        <div style="padding:10px 0; border-bottom:1px solid #eee;">
            <div style="font-weight:500; color:#2c3e50; font-size:14px; margin-bottom:5px;">
                ${post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
            </div>
            <div style="color:#7f8c8d; font-size:12px;">
                ${new Date(post.date).toLocaleDateString()}
            </div>
        </div>
    `).join('');
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPosts();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    loadRecentPosts();
    showSection('home');
});