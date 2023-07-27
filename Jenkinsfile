node {	
	stage('SCM') {
		dir('application-web') {
			checkout scm
			}
		dir('commondll'){
			checkout BbS(branches: [[name: '*/master']], credentialsId: 'bitbucket1', id: '38ffb31e-6156-49e0-979b-3f003ba10a63', mirrorName: '', projectName: 'OMS Product', repositoryName: 'CommonDLL', serverId: '4e3e5fa5-95ce-4273-95e1-67489f1a5fd4', sshCredentialsId: '')
		}
		dir ('sharerepos'){
			checkout BbS(branches: [[name: '*/master']], credentialsId: 'bitbucket1', extensions: [], id: 'b133ec73-4dee-41e9-82e1-3f9e2aa6f960', mirrorName: '', projectName: 'OMS Product', repositoryName: 'ShareRepos', serverId: '4e3e5fa5-95ce-4273-95e1-67489f1a5fd4', sshCredentialsId: '')
		}
	}
	stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner for MSBuild'
    withSonarQubeEnv() {
	  bat "dotnet ${scannerHome}\\SonarScanner.MSBuild.dll begin /k:\"OMSP_application-web\""
	  bat "dotnet build ./application-web"
	  bat "dotnet ${scannerHome}\\SonarScanner.MSBuild.dll end"
    }
  }	
}