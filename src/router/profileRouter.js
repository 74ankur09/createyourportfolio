const express = require("express")
const User = require("../model/userModel")

const profileRouter = express.Router();


profileRouter.get('/', (req, res) => {
    return res.render('projectProfile', {
        layout: false,
        name: 'Ankur Jain',
        desc1: 'Web Developer',
        desc2: 'Competitive Programmer',
        displayImage: 'profile.jpg'
    });
})


profileRouter.get('/:username', async (req, res) => {

    return res.redirect('/profile/'+req.params.username+'/home');
})


profileRouter.get('/:username/home', async (req, res) => {

    const user = await User.findOne({ username: req.params.username });
    
    console.log(req.params.username)

    if (user == null) {
        return res.redirect('/profile');
    }

    res.render('homeProfile', {
        layout: false,
        ...user.home,
        displayImage: 'temp.jpg'
    });
})


profileRouter.get('/:username/color', async (req, res) => {

    const user = await User.findOne({ username: req.params.username});

    if (user == null) {
        return res.status(404).send({});
    }

    res.status(200).send(user.color);
})


profileRouter.get('/:username/projects', async (req, res) => {

    const user = await User.findOne({ username: req.params.username});

    if (user == null) {
        return res.status(404).send({});
    }

    console.log(user.projects)

    var projects = [];

    if (user.projects.ptitle1 != null && user.projects.pdesc1) {
        projects.push(
            {
                title: user.projects.ptitle1,
                desc: user.projects.pdesc1,
                url: user.projects.purl1
            });
    }


    if (user.projects.ptitle2 != null && user.projects.pdesc2) {
        projects.push(
            {
                title: user.projects.ptitle2,
                desc: user.projects.pdesc2,
                url: user.projects.purl2
            });
    }


    if (user.projects.ptitle3 != null && user.projects.pdesc3) {
        projects.push(
            {
                title: user.projects.ptitle3,
                desc: user.projects.pdesc3,
                url: user.projects.purl3
            });
    }

    // console.log(projects)

    res.render('projectProfile', {
        layout: false,
        projects
    });
})




module.exports = profileRouter;