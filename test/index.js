// require dependencies

const baseUrl = 'http://localhost:3000';
const app     = require('../express');

// describe index page

describe('index.html\n', function () {

    it('should load the page properly', function (done) {

    	// request from the baseURL

    	request(baseUrl, function (error, response, body) {

    		// assert that there are no errors and appropriate 200 response returned

    		expect(error).to.be.not.ok;
    		expect(response).to.be.not.a('undefined');
    		expect(response.statusCode).to.be.equal(200);	

    		// async functions need to be closed with done

    		done();

    	});
  });

     it('should have the correct title', function (done) {

      // request from the baseURL

      request(baseUrl, function (error, response, body) {

      // bind $ to cheerio function

      const $ = cheerio.load(body);
      const header = $('title').html();

       // assert navbar title contains the correct text

       expect(string(header).contains('danval85 | gulp-framework')).to.be.ok;      

        // async functions need to be closed with done

        done();

      });
  });     

    it('should load the correct dependencies');  

});