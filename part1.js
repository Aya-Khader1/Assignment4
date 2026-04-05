const  express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());
const users = JSON.parse(fs.readFileSync('data.json','utf8'));

//1. Adds a new user
app.post('/users',(req,res)=>{
    const {email} =req.body;
    isExitEmail =  Object.values(users).some(((userEmail) => userEmail.email === email));
    console.log(isExitEmail);
    if(isExitEmail){
        res.status(400).json({message: 'Email already exists'});
    }else{
        let newId = Object.keys(users).length + 1;
        const {name,age,email} = req.body;
        users[newId] = { name, age, email };
        fs.writeFileSync('data.json',JSON.stringify(users,null,2));
        res.status(201).json({message: 'User created successfully'});
    }
     
});

//2. Updates an existing user's name, age, or email
function validateUserData(req, res, next) {
      const { name, age, email } = req.body;
    if (
        (name !== undefined && typeof name !== 'string') ||
        (age !== undefined && typeof age !== 'number') ||
        (email !== undefined && typeof email !== 'string')
    ) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    next();
}

app.patch('/users/:id',validateUserData,(req,res)=>{
    const {id} = req.params;
    if(users[id]){
        const {name,age,email} =req.body;
        console.log('users[id]',users[id]);
        users[id] = {name:name ?? users[id].name, age:age ?? users[id].age, email:email ?? users[id].email};
        fs.writeFileSync('data.json',JSON.stringify(users,null,2));
        res.status(200).json({message:'User updated successfully'});
        
    }
    else{
        res.status(404).json({message:'User not Found'})
    }

});
// 3. Deletes a User by ID
app.delete('/users/:id',(req,res)=>{
    const {id} = req.params;
    if(!users[id]){
            res.status(404).json({message:'User not Found'})
    }
    delete users[id];
    try {
        fs.writeFileSync('data.json', JSON.stringify(users, null, 2));
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error writing to file', error: err.message });
    }
});

//4. Get User 
app.get('/users',(req,res)=>{
    const {name}= req.query;
    if(name){
        const matchUser = Object.values(users).filter((user) => user.name.toLowerCase() === name.toLowerCase());
         if (matchUser.length > 0) {
            return res.status(200).json(matchUser);
        } else {
            return res.status(404).json({ message: 'User not Found' });
        }
    }

    else{
        return res.status(202).json(users);
    }

});
//5. Get All Users
app.get('/users/getAllUsers',(req,res)=>{
    res.status(200).json(users);
})


//6. API that filters users by minimum age

app.get('/users/filter',(req,res)=>{
    const {minAge} = req.query;
    const userByMinAge =Object.values(users).filter((user)=> user.age > parseInt(minAge));
    if(userByMinAge.length > 0){
        res.status(200).json(userByMinAge);
    }else{
        res.status(404).json({message:'No users found'})
    }
})

//7.Get User by ID
app.get('/users/:id',(req,res)=>{
    const {id} = req.params;
    if(users[id]){
        res.status(200).json(users[id]);
    }else{
        res.status(404).json({message:'User not Found'})
    }
})


app.listen(3000, () => {    
    console.log('Server is running on port 3000');
});