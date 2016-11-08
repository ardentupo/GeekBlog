/**
 * Created by eason on 16-11-7.
 */
const fs = require('fs');
const {Parser,Define,Database} = require('../index');
const readline = require('readline');

module.exports = (method,file)=>{
    switch (method){
        case 'create':
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            fs.exists(file,(exist)=>{
                if(exist){
                    let path = `${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`;
                    rl.question('title:',(answer)=>{
                        let title = answer;
                        rl.question('tag:',(answer)=>{
                            let json = {title:title,tag:answer,path:path};
                            new Database(`./${Define.data}`).addpost(json).flush();
                            fs.readFile(file, (err,data)=>{
                                let md = data.toString();
                                Parser.mdparse(md).then((html)=>{
                                    json.content = html;
                                    return Parser.tmplparse(`./${Define.layout}/${Define.postTmpl}`,json);
                                }).then((html)=>{
                                    fs.writeFile(`./${Define.build}/${path}`,html);
                                })
                            });
                            rl.close();
                        });
                    });
                }else{
                    console.log('Could not find the file!')
                }
            });
            break;
        case 'update':
            let path = `${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`;
            let database = new Database(`./${Define.data}`);
            let post = database.getpost({path:path});

            fs.exists(file,(exist)=>{
                if(exist){
                    fs.readFile(file, (err,data)=>{
                        let md = data.toString();
                        Parser.mdparse(md).then((html)=>{
                            post.content = html;
                            return Parser.tmplparse(`./${Define.layout}/${Define.postTmpl}`,post);
                        }).then((html)=>{
                            fs.writeFile(`./${Define.build}/${path}`,html);
                        })
                    });
                }else{
                    console.log('Could not find the file!')
                }
            });
            break;
        case 'delete':
            fs.exists(file,(exist)=>{
                if(exist){
                    fs.unlinkSync(file);
                }
                new Database(`./${Define.data}`).rmpost({path:`${/\/.*\/(.*)\.md$/.exec(file)[1]}.html`}).flush();
            });
            break;
    }
};