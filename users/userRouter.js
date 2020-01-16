const express = require('express');

const Users = require('./userDb.js')
const Posts = require('../posts/postDb.js')
const router = express.Router();


//POST a user to the users
router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error adding the user',
    });
  });
});


//POST a post to user by id
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  
  const postInfo = { ...req.body, user_id:req.params.id}
  
  Posts.insert(postInfo)
  .then(response => {
    res.status(201).json(response)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: 'Post not added' });
  })
});


//GET all the users
router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving users',
      });
    });
});

//GET user by id 
router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
  .then(user => {
      res.status(200).json(user);  
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving user'
    });
  });
});


//GET posts by user id
router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Posts.getById(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch (error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error getting the posts for the user',
    });
  });
});


//DELETE user by id
router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
  .then(count => {
      res.status(200).json({ message: 'The user has been eliminated' });
   
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error removing the user',
    });
  });
});

//PUT update to user by id
router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const { name } = req.body;
  Users.update(id, {name: name})
  .then(() => {
    return res.status(200).json({ message: "User Updated"});
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({ error: "User not updated." });
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const userId = [];
  if (req.params.id) {
    const { id } = req.params;
    Users.get()
      .then(response => {
        response.map(element => {
          userId.push(element.id);
        })
        
        if (userId.includes(Number(id))) {
          next();
        }
        else {
          res.status(400).json({  message: "invalid user id" });
        }
      })
      .catch(err => {
        console.log(err);
      })
  }
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing user data" })
  }
  else {
    if (req.body.name) {
      next();
    }
    else {
      res.status(400).json({ message: "missing required name field" }
      )
    } 
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing post data" })
  }
  else {
    if (req.body.text) {
      next();
    }
    else {
      res.status(400).json({ message: "missing required text field" }
      )
    } 
  }
}

module.exports = router;
