import Gnode from './Gnode';
const { Octokit } = require('@octokit/rest');

class GitTree {

  octokit: typeof Octokit;
  root: Gnode; 
  github: any;
  owner: string;
  repo: string;
  token: string | undefined;

  constructor(owner: string, repo: string, token?: string) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;

    if (token) {
      this.octokit = new Octokit({
        auth: token,
      });
    } else {
      this.octokit = new Octokit();
    }

    let authInfo = {octokit: this.octokit, 
                    owner: owner, 
                    repo: repo};
    
    this.root = new Gnode(
      authInfo,
      null,
      { name: '',
        path: '',
        type: 'dir',
        size: 0,
        downloadUrl: null },
      true)


    
    /* TODO: This below is if I ever use octokit getTree() instead, which */
    /* could save on a lot of API calls but also mean a lot more edge-cases */

    /* this.octokit.repos.getBranch({ */
    /*   owner: owner, */
    /*   repo: repo, */
    /*   branch: 'master', */
    /* }).then( (res: any) => { */
    /*   let treeSha = res.data.commit.sha; */
    /*   return this.octokit.git.getTree({ */
    /*     owner: owner, */
    /*     repo: repo, */
    /*     tree_sha: treeSha, */
    /*     recursive: true, */
    /*   }); */
    /* }).then( (res: any) => { */
    /*   console.log(res.data.tree); */
    /* }) */
  }

  async init() {
    await this.root.touch();
  }

  depth(): number {
    return this.root.depth();
  }

  get(path: Array<string>): Gnode {
    let currentNode: Gnode | undefined;
    currentNode = this.root;
    for (let name of path) {
      currentNode = currentNode.files!.find((node) => node.name == name)

      if (currentNode == undefined || currentNode.files == undefined) {
        throw 'Path does not exist. Or it\'s a bug I made. Probably the latter.'
      }
    }
    return currentNode;
  }
}


export default GitTree;