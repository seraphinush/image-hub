-- ****************************************
-- Create Table
-- ****************************************

CREATE TABLE [dbo].[User](
	[UId] [nvarchar](128) NOT NULL,
    [UserName] [nvarchar](128) NOT NULL,
  	[Role] [nvarchar](10), 
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
	[UploadedBy][nvarchar](128) NOT NULL
);

CREATE TABLE [dbo].[Log](
	[LId] [nvarchar](128) NOT NULL,
    [UId] [nvarchar](128) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[LogFile] [nvarchar](1000) NOT NULL
);

CREATE TABLE [dbo].[LogLink](
	[LLinkId] [int] IDENTITY (1,1) NOT NULL,
	[LId] [nvarchar](128) NOT NULL,
	[IId] [nvarchar](128) NOT NULL
);

CREATE TABLE [dbo].[Tag](
	[TagName] [nvarchar](128) NOT NULL,
        [Description] [nvarchar](1000) NOT NULL,
        [Active] [bit] NOT NULL
);

CREATE TABLE [dbo].[TagLink](
	[TLinkId] [int] IDENTITY (1,1) NOT NULL,
	[TagName] [nvarchar](128) NOT NULL,
        [IId] [nvarchar](128) NOT NULL
);

CREATE TABLE [dbo].[Project](
	[ProjectName] [nvarchar](128) NOT NULL,
 	[CreatedDate] [datetime] NOT NULL,
	[Description] [nvarchar](1000) NOT NULL,
	[Active][bit] NOT NULL
);

CREATE TABLE [dbo].[ProjectLink](
	[PLinkId] [int] IDENTITY (1,1) NOT NULL,
	[ProjectName] [nvarchar](128) NOT NULL,
    [IId] [nvarchar](128) NOT NULL
);

CREATE TABLE [dbo].[Metadata](
	[MetaName] [nvarchar](128) NOT NULL,
	[Active] [bit] NOT NULL,
	[Mandatory] [bit] NOT NULL
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

ALTER TABLE [dbo].[LogLink] WITH CHECK ADD 
    CONSTRAINT [PK_LogLink] PRIMARY KEY CLUSTERED
	(
	[LLinkId]
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

ALTER TABLE [dbo].[Metadata] WITH CHECK ADD 
    CONSTRAINT [PK_Metadata] PRIMARY KEY CLUSTERED
	(
	[MetaName]
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

ALTER TABLE [dbo].[LogLink] WITH CHECK ADD
    CONSTRAINT [FK_LogLink1] FOREIGN KEY  
    (
        [LId]
    ) REFERENCES [dbo].[Log] ([LId]) ON DELETE CASCADE;

ALTER TABLE [dbo].[LogLink] WITH CHECK ADD
    CONSTRAINT [FK_LogLink2] FOREIGN KEY  
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

CREATE NONCLUSTERED INDEX [IX_LogLink_LId_IId] ON [dbo].[LogLink]([LId],[IId]);

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
   VALUES('43982bd9-c06d-43be-9e4a-e736cb345b0c', 'UserA', 'User', 1)
INSERT INTO [dbo].[User]
   VALUES('ab1f1812-8db6-455c-81a8-efab737a2fd8', 'UserB', 'User', 1)
INSERT INTO [dbo].[User]
   VALUES('41653f3a-3308-41d9-85ce-886b5756802f', 'UserC', 'User', 0)
INSERT INTO [dbo].[User]
   VALUES('21eb56a3-fea9-48a6-bc23-15ad9b48b52e', 'UserD', 'admin', 1)

INSERT INTO [dbo].[Image]
   VALUES('hashA', '43982bd9-c06d-43be-9e4a-e736cb345b0c', 'bridgeA', 1000, '2012-07-18 10:34:09', 'JPG', 0, NULL, 0,'43982bd9-c06d-43be-9e4a-e736cb345b0c')
INSERT INTO [dbo].[Image]
   VALUES('hashB', '43982bd9-c06d-43be-9e4a-e736cb345b0c', 'bridgeB', 2000, '2012-03-18 10:34:09', 'JPG', 1, '2012-06-18 10:34:09', 0,'43982bd9-c06d-43be-9e4a-e736cb345b0c')
INSERT INTO [dbo].[Image]
   VALUES('hashC', '43982bd9-c06d-43be-9e4a-e736cb345b0c', 'pyramidA', 3000, '2012-05-02 10:34:09', 'JPG', 0, NULL, 1,'43982bd9-c06d-43be-9e4a-e736cb345b0c')
INSERT INTO [dbo].[Image]
   VALUES('hashD', '43982bd9-c06d-43be-9e4a-e736cb345b0c', 'pyramidB', 4000, '2013-06-13 10:34:09', 'JPG', 1, '2012-06-18 10:34:09', 1,'43982bd9-c06d-43be-9e4a-e736cb345b0c')
INSERT INTO [dbo].[Image]
   VALUES('hashE', 'ab1f1812-8db6-455c-81a8-efab737a2fd8', 'command center', 1000, '2016-06-18 10:34:09', 'PNG', 0, NULL, 0,'ab1f1812-8db6-455c-81a8-efab737a2fd8')
INSERT INTO [dbo].[Image]
   VALUES('hashF', '41653f3a-3308-41d9-85ce-886b5756802f', 'satellite', 2000, '2011-06-18 10:34:09', 'BMP', 0, NULL, 0,'41653f3a-3308-41d9-85ce-886b5756802f')
INSERT INTO [dbo].[Image]
   VALUES('hashG', '21eb56a3-fea9-48a6-bc23-15ad9b48b52e', 'UFO', 3000, '2010-05-18 10:34:09', 'JPG', 0, NULL, 0,'21eb56a3-fea9-48a6-bc23-15ad9b48b52e')
INSERT INTO [dbo].[Image]
   VALUES('hashH', '21eb56a3-fea9-48a6-bc23-15ad9b48b52e', 'balloon', 3000, '2010-02-18 10:34:09', 'JPG', 0, NULL, 1,'21eb56a3-fea9-48a6-bc23-15ad9b48b52e')

INSERT INTO [dbo].[Log]
   VALUES('log1', '43982bd9-c06d-43be-9e4a-e736cb345b0c', '2012-07-18 10:34:09', 'bridgeA Submitted')
INSERT INTO [dbo].[Log]
   VALUES('log2', '43982bd9-c06d-43be-9e4a-e736cb345b0c', '2012-03-18 10:34:09', 'bridgeA,B Submitted')
INSERT INTO [dbo].[Log]
   VALUES('log3', '21eb56a3-fea9-48a6-bc23-15ad9b48b52e', '2012-02-18 10:34:09', 'balloon Submitted')


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
   VALUES('NonProject', '2008-01-01 10:34:09', 'image which are not in project',1)
INSERT INTO [dbo].[Project]
   VALUES('Capilano Bridge', '2010-04-08 10:34:09', 'build bridge',1)
INSERT INTO [dbo].[Project]
   VALUES('Modern Pyramid', '2012-06-18 10:34:09', 'build building',1)
INSERT INTO [dbo].[Project]
   VALUES('SpaceX', '2011-06-18 10:34:09', 'build space shuttle',0)


INSERT INTO [dbo].[TagLink]
   VALUES('bridge', 'hashA')
INSERT INTO [dbo].[TagLink]
   VALUES('bridge', 'hashB')
INSERT INTO [dbo].[TagLink]
   VALUES('building', 'hashC')
INSERT INTO [dbo].[TagLink]
   VALUES('building', 'hashD')
INSERT INTO [dbo].[TagLink]
   VALUES('center', 'hashE')
INSERT INTO [dbo].[TagLink]
   VALUES('space', 'hashF')
INSERT INTO [dbo].[TagLink]
   VALUES('space', 'hashG')

INSERT INTO [dbo].[ProjectLink]
   VALUES('Capilano Bridge', 'hashA')
INSERT INTO [dbo].[ProjectLink]
   VALUES('Capilano Bridge', 'hashB')
INSERT INTO [dbo].[ProjectLink]
   VALUES('Modern Pyramid', 'hashC')
INSERT INTO [dbo].[ProjectLink]
   VALUES('Modern Pyramid', 'hashD')

INSERT INTO [dbo].[LogLink]
   VALUES('log1', 'hashA')
INSERT INTO [dbo].[LogLink]
   VALUES('log2', 'hashA')
INSERT INTO [dbo].[LogLink]
   VALUES('log2', 'hashB')
INSERT INTO [dbo].[LogLink]
  VALUES('log3', 'hashH')

INSERT INTO [dbo].[Metadata]
  VALUES('User', 1, 1)
 INSERT INTO [dbo].[Metadata]
  VALUES('Date', 1, 1)
INSERT INTO [dbo].[Metadata]
  VALUES('Project', 1, 1)
INSERT INTO [dbo].[Metadata]
  VALUES('Classification', 1, 1)
