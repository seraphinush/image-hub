-- ****************************************
-- Create Table
-- ****************************************

CREATE TABLE [dbo].[User](
	[UId] [nvarchar](128) NOT NULL,
      	[UserName] [nvarchar](128) NOT NULL,
  	[Role] [nvarchar](10), 
	[Admin] [bit] NOT NULL,
	[Active] [bit] NOT NULL
); 

CREATE TABLE [dbo].[Image](
	[IId] [nvarchar](128) NOT NULL,
	[UId] [nvarchar](128) NOT NULL,
	[ImageName] [nvarchar](128) NOT NULL,
	[Size] [int] NOT NULL,
 	[UploadedDate] [datetime] NOT NULL,
	[Type] [nvarchar](10) NOT NULL,
	[Trashed] [bit] NOT NULL,
	[TrashedDate] [datetime],
	[Submitted] [bit] NOT NULL,
);

CREATE TABLE [dbo].[Log](
	[LId] [nvarchar](128) NOT NULL,
        [UId] [nvarchar](128) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[Log] [nvarchar](1000) NOT NULL
);

CREATE TABLE [dbo].[Tag](
	[TagName] [nvarchar](128) NOT NULL,
        [Description] [nvarchar](1000) NOT NULL,
        [Active] [bit] NOT NULL
);

CREATE TABLE [dbo].[TagLink](
	[TLinkId] [int] NOT NULL,
	[TagName] [nvarchar](128) NOT NULL,
        [IId] [nvarchar](128) NOT NULL
);

CREATE TABLE [dbo].[Project](
	[ProjectName] [nvarchar](128) NOT NULL,
 	[CreatedDate] [datetime] NOT NULL,
	[Description] [nvarchar](1000) NOT NULL
);

CREATE TABLE [dbo].[ProjectLink](
	[PLinkId] [int] NOT NULL,
	[ProjectName] [nvarchar](128) NOT NULL,
        [IId] [nvarchar](128) NOT NULL
);

-- ****************************************
-- Set Primary key
-- ****************************************

ALTER TABLE [dbo].[User] WITH CHECK ADD 
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED
	(
	[UId]
	) ;

ALTER TABLE [dbo].[Image] WITH CHECK ADD 
    CONSTRAINT [PK_Image] PRIMARY KEY CLUSTERED
	(
	[IId]
	) ;

ALTER TABLE [dbo].[Log] WITH CHECK ADD 
    CONSTRAINT [PK_Log] PRIMARY KEY CLUSTERED
	(
	[LId]
	) ;

ALTER TABLE [dbo].[Tag] WITH CHECK ADD 
    CONSTRAINT [PK_Tag] PRIMARY KEY CLUSTERED
	(
	[TagName]
	) ;

ALTER TABLE [dbo].[TagLink] WITH CHECK ADD 
    CONSTRAINT [PK_TagLink] PRIMARY KEY CLUSTERED
	(
	[TLinkId]
	) ;

ALTER TABLE [dbo].[Project] WITH CHECK ADD 
    CONSTRAINT [PK_Project] PRIMARY KEY CLUSTERED
	(
	[ProjectName]
	) ;

ALTER TABLE [dbo].[ProjectLink] WITH CHECK ADD 
    CONSTRAINT [PK_ProjectLink] PRIMARY KEY CLUSTERED
	(
	[PLinkId]
	) ;

-- ****************************************
-- Set Foreign key
-- ****************************************

ALTER TABLE [dbo].[Image] WITH CHECK ADD 
    CONSTRAINT [FK_Image] FOREIGN KEY 
    (
        [UId]
    ) REFERENCES [dbo].[User] ([UId]);

ALTER TABLE [dbo].[Log] WITH CHECK ADD 
    CONSTRAINT [FK_Log] FOREIGN KEY 
    (
        [UId]
    ) REFERENCES [dbo].[User] ([UId]);

ALTER TABLE [dbo].[TagLink] WITH CHECK ADD 
    CONSTRAINT [FK_TagLink1] FOREIGN KEY 
    (
        [TagName]
    ) REFERENCES [dbo].[Tag] ([TagName]) ON DELETE CASCADE;

ALTER TABLE [dbo].[TagLink] WITH CHECK ADD 
    CONSTRAINT [FK_TagLink2] FOREIGN KEY 
    (
        [IId]
    ) REFERENCES [dbo].[Image] ([IId]) ON DELETE CASCADE;

ALTER TABLE [dbo].[ProjectLink] WITH CHECK ADD
    CONSTRAINT [FK_ProjectLink1] FOREIGN KEY  
    (
        [ProjectName]
    ) REFERENCES [dbo].[Project] ([ProjectName]) ON DELETE CASCADE;

ALTER TABLE [dbo].[ProjectLink] WITH CHECK ADD
    CONSTRAINT [FK_ProjectLink2] FOREIGN KEY  
    (
        [IId]
    ) REFERENCES [dbo].[Image] ([IId]) ON DELETE CASCADE;

GO

-- ****************************************
-- Create Index
-- ****************************************

CREATE NONCLUSTERED INDEX [IX_User_Active] ON [dbo].[User]([Active]);

CREATE NONCLUSTERED INDEX [IX_Log_CreatedDate] ON [dbo].[Log]([CreatedDate]);

CREATE NONCLUSTERED INDEX [IX_Log_UId] ON [dbo].[Log]([UId]);

CREATE NONCLUSTERED INDEX [IX_ProjectLink_IId_ProjectName] ON [dbo].[ProjectLink]([IId],[ProjectName]);

CREATE NONCLUSTERED INDEX [IX_TagLink_IId_TagName] ON [dbo].[TagLink]([IId],[TagName]);

CREATE NONCLUSTERED INDEX [IX_Image_Trashed_UId_TrashedDate] ON [dbo].[Image]([Trashed],[UId],[TrashedDate]);

CREATE NONCLUSTERED INDEX [IX_Image_UId_Trashed_Submitted] ON [dbo].[Image]([UId],[Trashed],[Submitted]);

GO

-- ****************************************
-- Create Trigger
-- ****************************************



-- ****************************************
-- Insert data entry
-- ****************************************

INSERT INTO [dbo].[User]
   VALUES('userA', 'Adam', 'programmer', 0, 1)
INSERT INTO [dbo].[User]
   VALUES('userB', 'James', 'designer', 0, 1)
INSERT INTO [dbo].[User]
   VALUES('userC', 'John', 'CEO', 0, 0)
INSERT INTO [dbo].[User]
   VALUES('userD', 'Mike', 'admin', 1, 1)

INSERT INTO [dbo].[Image]
   VALUES('hashA', 'userA', 'big bridgeA', 1000, '2012-06-18 10:34:09', 'JPEG', 0, NULL, 0)
INSERT INTO [dbo].[Image]
   VALUES('hashB', 'userA', 'big bridgeB', 2000, '2012-06-18 10:34:09', 'PNG', 1, '2012-06-18 10:34:09', 0)
INSERT INTO [dbo].[Image]
   VALUES('hashC', 'userA', 'small buildingA', 3000, '2012-06-18 10:34:09', 'JPEG', 0, NULL, 1)
INSERT INTO [dbo].[Image]
   VALUES('hashD', 'userA', 'small buildingB', 4000, '2012-06-18 10:34:09', 'GIF', 1, '2012-06-18 10:34:09', 1)
INSERT INTO [dbo].[Image]
   VALUES('hashE', 'userB', 'command center', 1000, '2012-06-18 10:34:09', 'PNG', 0, NULL, 0)
INSERT INTO [dbo].[Image]
   VALUES('hashF', 'userC', 'satellite', 2000, '2012-06-18 10:34:09', 'BMP', 0, NULL, 0)
INSERT INTO [dbo].[Image]
   VALUES('hashG', 'userD', 'UFO', 3000, '2012-06-18 10:34:09', 'BMP', 0, NULL, 0)
INSERT INTO [dbo].[Image]
   VALUES('hashH', 'userD', 'balloon', 3000, '2012-06-18 10:34:09', 'JPEG', 0, NULL, 1)

INSERT INTO [dbo].[Log]
   VALUES('log1', 'userA', '2012-06-18 10:34:09', 'small buildingA Submitted')
INSERT INTO [dbo].[Log]
   VALUES('log2', 'userA', '2012-06-18 10:34:09', 'small buildingB Submitted')
INSERT INTO [dbo].[Log]
   VALUES('log3', 'userD', '2012-06-18 10:34:09', 'balloon Submitted')


INSERT INTO [dbo].[Tag]
   VALUES('bridge', 'bridges', 1)
INSERT INTO [dbo].[Tag]
   VALUES('building', 'buildings', 1)
INSERT INTO [dbo].[Tag]
   VALUES('space', 'space objects', 1)
INSERT INTO [dbo].[Tag]
   VALUES('center', 'command center', 0)
INSERT INTO [dbo].[Tag]
   VALUES('car', 'cars', 1)

INSERT INTO [dbo].[Project]
   VALUES('bridge builder', '2012-06-18 10:34:09', 'build bridge')
INSERT INTO [dbo].[Project]
   VALUES('make building', '2012-06-18 10:34:09', 'build building')


INSERT INTO [dbo].[TagLink]
   VALUES(1,'bridge', 'hashA')
INSERT INTO [dbo].[TagLink]
   VALUES(2,'bridge', 'hashB')
INSERT INTO [dbo].[TagLink]
   VALUES(3,'building', 'hashC')
INSERT INTO [dbo].[TagLink]
   VALUES(4,'building', 'hashD')
INSERT INTO [dbo].[TagLink]
   VALUES(5,'center', 'hashE')
INSERT INTO [dbo].[TagLink]
   VALUES(6,'space', 'hashF')
INSERT INTO [dbo].[TagLink]
   VALUES(7,'space', 'hashG')

INSERT INTO [dbo].[ProjectLink]
   VALUES(1,'bridge builder', 'hashA')
INSERT INTO [dbo].[ProjectLink]
   VALUES(2,'bridge builder', 'hashB')
INSERT INTO [dbo].[ProjectLink]
   VALUES(3,'make building', 'hashC')
INSERT INTO [dbo].[ProjectLink]
   VALUES(4,'make building', 'hashD')


