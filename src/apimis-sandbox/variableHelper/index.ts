import TemporaryVariables from './temporaryVariables';
import IterationData from './iterationData';
import GlobalVariables from './globalVariables';
import EnvironmentVariables from './environmentVariables';
import CollectionVariables from './collectionVariables';

class VariablesHelper {
  //临时变量操作库
  public temporary;
  public iterationData;
  public global;
  public environment;
  public collection;

  constructor(variablesScope, getDynamicVariables, replaceVariables) {
    //初始化内置变量
    this.temporary = new TemporaryVariables(
      variablesScope.temporary,
      getDynamicVariables,
      replaceVariables
    );
    this.iterationData = new IterationData(variablesScope.iterationData, replaceVariables);
    this.global = new GlobalVariables(variablesScope.global, replaceVariables);
    this.environment = new EnvironmentVariables(variablesScope.environment, replaceVariables);
    this.collection = new CollectionVariables(variablesScope.collection, replaceVariables);
  }
}

export default VariablesHelper;
