pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Git 저장소에서 소스 코드를 가져옴
                git 'https://github.com/your-username/your-nestjs-app.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // NestJS 프로젝트 의존성 설치
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                // NestJS 프로젝트 빌드
                sh 'npm run build'
            }
        }
        
        stage('Unit Test') {
            steps {
                // 테스트 실행
                sh 'npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                // 빌드 결과를 서버에 배포
                // 예: NestJS 애플리케이션을 웹 서버에 배포
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        
        failure {
            echo 'Pipeline failed!'
        }
    }
}
