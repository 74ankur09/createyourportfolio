const express = require("express")
const User = require("../model/userModel")
const auth = require('../middleware/auth')

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    return res.render('login', {
        layout: false
    })
})

userRouter.get('/home', auth, (req, res) => {

    //console.log({ ...req.user.home });

    return res.render('homeForm', {
        layout: 'user',
        username: req.user.username,
        ...req.user.home
    });
})



userRouter.get('/color', auth, (req, res) => {

    // //console.log({ ...req.user.color });

    return res.render('colorForm', {
        layout: 'user',
        username: req.user.username,
        ...req.user.color
    });
})


userRouter.get('/projects', auth, (req, res) => {

    return res.render('projectsForm', {
        layout: 'user',
        username: req.user.username,
        ...req.user.projects
    });
})



userRouter.post('/home', auth, async (req, res) => {

    //console.log(req.body)

    req.user.home = req.body;
    
    
    const okSave = await req.user.homeValidation();

    //console.log(okSave)

    if (!okSave.ok) {
        return res.status(400).send({ error: okSave.error });
    }

    req.user.save().then( async () => {
        //console.log(req.user)
        return res.status(200).send(req.user);
    }).catch( (e) => {
        //console.log(e)
        return res.status(400).send(e);
    })

})



userRouter.post('/color', auth, async (req, res) => {

    //console.log(req.body)

    req.user.color = req.body;
    
    
    const okSave = await req.user.colorValidation();

    //console.log(okSave)

    if (!okSave.ok) {
        return res.status(400).send({ error: okSave.error });
    }

    req.user.save().then( async () => {
        //console.log(req.user)
        return res.status(200).send(req.user);
    }).catch( (e) => {
        //console.log(e)
        return res.status(400).send(e);
    })

})




userRouter.post('/projects', auth, async (req, res) => {

    //console.log(req.body)

    req.user.projects = req.body;
    
    
    const okSave = await req.user.projectValidation();

    //console.log(okSave)

    if (!okSave.ok) {
        return res.status(400).send({ error: okSave.error });
    }

    req.user.save().then( async () => {
        //console.log(req.user)
        return res.status(200).send(req.user);
    }).catch( (e) => {
        //console.log(e)
        return res.status(400).send(e);
    })

})


userRouter.post('/signup', async (req,res) => {

    var user = new User(req.body);

    //console.log(user);

    const okSave = await user.qualifySave();

    //console.log(okSave)

    if (!okSave.ok) {
        return res.status(400).send({ error: okSave.error });
    }

    
    user.save().then( async () => {
        const token = await user.generateAuthToken();
        //console.log(user)
        res.cookie('authToken', token, {
            sameSite: 'strict',
            maxAge: 14000000,
            path: '/user'
        });
        return res.status(201).send({user, token});
    }).catch( (e) => {
        //console.log(e)
        return res.status(400).send(e);
    })

})

userRouter.post('/login', (req,res) => {
    console.log(req.body);

    User.findByCredentials(req.body.email, req.body.password).then(async (returnVal) => {
        console.log('findby');
        if (returnVal.user == null) {

            return res.status(400).send(returnVal);
        }
        console.log('findby');
        const user = returnVal.user;

        const token = await user.generateAuthToken();
        console.log(user)
        // console.log('error ankur')
        res.cookie('authToken', token, {
            sameSite: 'strict',
            maxAge: 14000000,
            path: '/user'
        });
        return res.status(200).send({user, token});
    }).catch((e) => {
        return res.status(400).send(e.toString());
    })

})


userRouter.get('/logout', auth, async (req,res) => {
    //console.log(req.user)
    try {

        await req.user.save();
        res.clearCookie('authToken', {path:'/user'});
        res.redirect("/user");
    } catch (e) {
        res.status(500).send(e.toString());
    }
})


module.exports = userRouter;
