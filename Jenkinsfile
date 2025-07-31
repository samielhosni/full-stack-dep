pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'     // Jenkins credentials ID for Docker Hub
        SSH_CREDENTIALS_ID = 'vm-ssh-creds'                    // Jenkins credentials ID for VM access
        DOCKERHUB_USER = 'samihosni'
        GIT_TOKEN = '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'
        REMOTE_USER = 'remote'
        REMOTE_HOST = '192.168.32.128'
        GIT_USER = "samielhosni"
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
                        dir('./chat-history-service') 
                            {
                                        sh 'mvn clean install -DskipTests'
                            }
                        sh 'docker build -t $DOCKERHUB_USER/springboot-app:latest ./chat-history-service'
                }
            }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                 sh """
                        echo $PASSWORD | docker login -u $USERNAME --password-stdin
                        docker push $DOCKERHUB_USER/frontend-react:latest
                        docker push $DOCKERHUB_USER/backend-flask:latest
                        docker push $DOCKERHUB_USER/springboot-app:latest
                    """

                }
            }
        }

        stage('Deploy to Remote VM') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_TOKEN'),
                    usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')
                ]) {
                    sshagent([SSH_CREDENTIALS_ID]) {
                        // Docker login on remote VM
                        sh "ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST 'echo \"$DOCKERHUB_PASSWORD\" | docker login -u \"$DOCKERHUB_USERNAME\" --password-stdin'"

                        // Pull latest Docker images
                        sh "ssh $REMOTE_USER@$REMOTE_HOST 'docker login | docker pull $DOCKERHUB_USER/frontend-react:latest'"
                        sh "ssh $REMOTE_USER@$REMOTE_HOST 'docker login | docker pull $DOCKERHUB_USER/backend-flask:latest'"
                        sh "ssh $REMOTE_USER@$REMOTE_HOST 'docker login | docker pull $DOCKERHUB_USER/springboot-app:latest'"

                        // Clean and clone repository
                        sh "ssh $REMOTE_USER@$REMOTE_HOST 'rm -rf full-stack-dep || true'"
                        sh "ssh $REMOTE_USER@$REMOTE_HOST 'git clone https://$GIT_USERNAME:$GIT_TOKEN@github.com/samielhosni/full-stack-dep.git'"

                        // Restart containers with Docker Compose
                        sh "ssh $REMOTE_USER@$REMOTE_HOST 'cd full-stack-dep && docker compose down || true && docker compose up -d'"
                    }
                }
            }
        }


    }

}
