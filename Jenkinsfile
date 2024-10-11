pipeline {
    agent any

    environment {
        IMAGE_NAME = 'myapp/hdtask6.2'
        CONTAINER_NAME = 'myapp'
        NETLIFY_SITE_ID = '4c9e472c-bbad-4558-b6f3-d02912a59926' 
        NETLIFY_AUTH_TOKEN = credentials('nfp_tJQWcC6kBNY39JyYgzDuzheCxSqwejDvf532') 
        DATADOG_API_KEY = credentials('DATADOG_API_KEY') // Make sure this credential is added in Jenkins
    }

    stages {
        stage('BUILD') {
            steps {
                script {
                    echo 'Building Docker image...'
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }

        stage('TEST') {
            steps {
                script {
                    echo 'Running Selenium tests...'

                    // Stop and remove any existing container with the same name
                    sh '''
                    if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
                        docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME
                    fi
                    '''

                    // Start the application container
                    sh 'docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME'
                    
                    // Install necessary packages
                    sh 'npm install selenium-webdriver'

                    // Run the Selenium tests
                    sh 'node test.js'

                    // Stop and remove the Docker container after tests
                    sh 'docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME'
                }
            }
        }

        stage('BUILD REACT APP') {
            steps {
                echo 'Building React App for production...'
                sh 'npm run build' // This will generate the ./build directory
            }
        }

        stage('DEPLOY TO NETLIFY') {
            steps {
                script {
                    echo 'Deploying to Netlify...'

                    // Install Netlify CLI
                    sh 'npm install -g netlify-cli'

                    // Deploy the site using Netlify CLI
                    sh '''
                    netlify deploy --prod --dir=build --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
                    '''
                }
            }
        }

        stage('MONITORING') {
            steps {
                script {
                    echo 'Integrating Datadog monitoring...'
                    // This will display monitoring information
                    echo "Monitoring URL: https://hdtaskk.netlify.app"
                    echo "Check the Datadog dashboard for live status updates."

                    // Optional: Push custom metrics to Datadog (e.g., Jenkins job status or app health)
                    sh '''
                    curl -X POST "https://api.datadoghq.com/api/v1/series" \
                    -H "Content-Type: application/json" \
                    -H "DD-API-KEY: ${DATADOG_API_KEY}" \
                    -d '{
                        "series": [{
                            "metric": "jenkins.job.status",
                            "points": [[`date +%s`, 1]],
                            "tags": ["project:myapp", "env:production"],
                            "type": "gauge",
                            "host": "JENKINS"
                        }]
                    }'
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                node {
                    echo 'Cleaning up the workspace...'
                    cleanWs()
                }
            }
        }
    }
}
