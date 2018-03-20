'use strict';

const Team = require('../model/team-model');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = function (router){
  
  router.route('/teams/:_id?')
      
    .get(bearerAuthMiddleware,(request,response) => {
      //  returns one team
      console.log('in get route');
      if(request.params._id){
        return Team.findById(request.params._id)
          .then(team => response.status(200).json(team))
          .catch(error => errorHandler(error,response));
      }

      // returns all the team
      
      return Team.find()
        .then(teams => {
          let teamIds = teams.map(team => team._id);

          response.status(200).json(teamIds);
        })
        .catch(error => errorHandler(error,response));
      
    })
    .put(bearerAuthMiddleware,bodyParser,(request,response) => {
      Team.findById(request.params._id)
        .then(team => {
          console.log(team);
          if(team._id.toString() === request.params._id.toString()){
            team.name = request.body.name || team.name;
            team.coach = request.body.coach || team.coach;
            team.birthyear = request.body.birthyear || team.birthyear;
            team.classification = request.body.classification || team.classification;
            team.results = request.body.results || team.results;
            return team.save();
          }

          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    })

    .delete(bearerAuthMiddleware,(request,response) => {
      return Team.findById(request.params._id)
        .then(team => {
          if(team._id.toString() === request.params._id.toString())
            return team.remove();
          
          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    });
};