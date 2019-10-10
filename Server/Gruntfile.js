'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      server: {
        src: ['*.js']
      },
      Common: {
        src: ['Common/*.js']
      },
      googleUpload: {
        src: ['googleUpload/*.js']
      },
      RepairCode: {
        src: ['RepairCode/*.js']
      },
      RepairDetails: {
        src: ['RepairDetails/*.js']
      },
      RepairSearch: {
        src: ['RepairSearch/*.js']
      },
      SKUToken: {
        src: ['SKUToken/*.js']
      },
      TokenGeneration: {
        src: ['TokenGeneration/*.js']
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-mocha-test');

  // Default task.
  grunt.registerTask('default', ['jshint']);

};