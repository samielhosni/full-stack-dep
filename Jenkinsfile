pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'     // Jenkins credentials ID for Docker Hub
        SSH_CREDENTIALS_ID = 'vm-ssh-creds'                    // Jenkins credentials ID for VM access
        DOCKERHUB_USER = 'samihosni'
        REMOTE_USER = 'youruser'
        REMOTE_HOST = 'your.remote.ip'
    }

    stages {
         stage('Clone Repo') {
                steps {
                    git branch: 'main', credentialsId: 'github-creds', url: 'https://github.com/samielhosni/full-stack-dep.git'
                }
            }


            stage('Build Docker Images') {
                    steps {
                        sh 'docker build --no-cache -t $DOCKERHUB_USER/frontend-react:latest ./frontend'
                        sh 'docker build -t $DOCKERHUB_USER/backend-flask:latest ./flask-ollama'
                        sh 'docker build -t $DOCKERHUB_USER/springboot-app:latest ./chat-history-service'
                }
            }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh """
                        echo %PASSWORD% | docker login -u %USERNAME% --password-stdin
                        docker push %DOCKERHUB_USER%/frontend-react:latest
                        docker push %DOCKERHUB_USER%/backend-flask:latest
                        docker push %DOCKERHUB_USER%/springboot-app:latest
                    """
                }
            }
        }

        /*stage('Deploy to Remote VM') {
            steps {
                sshagent([SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST '
                            docker pull $DOCKERHUB_USER/frontend-react:latest
                            docker pull $DOCKERHUB_USER/backend-flask:latest
                            rm -rf full-stack-dep || true
                            git clone https://github.com/samielhosni/full-stack-dep.git full-stack-dep
                            cd full-stack-dep
                            docker compose down || true
                            docker compose up -d
                        '
                    """
                }
            }
        } */
    }
}