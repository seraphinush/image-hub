-- ****************************************
-- Drop Database
-- ****************************************
PRINT '';
PRINT '*** Dropping Database';

IF EXISTS (SELECT [name] FROM [master].[sys].[databases] WHERE [name] = 'ihubDB')
    DROP DATABASE ihubDB;
GO

-- ****************************************
-- Create Database
-- ****************************************
PRINT '';
PRINT '*** Creating Database';

CREATE DATABASE ihubDB;
GO



